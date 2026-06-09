/**
 * POST /api/sf023-webhook
 * Dropbox Sign callback handler.
 * Fires when Josh signs (signature_request_signed / all_signed) or declines.
 * On completion: fetches the signed PDF, emails it to the original requester via MS Graph.
 *
 * Dropbox Sign callback verification:
 *   They POST JSON with { event: { event_type, event_metadata }, signature_request: {...} }
 *   You must respond with text "Hello API Event Received" (exactly) to acknowledge.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSignedDocument } from '@/lib/dropbox-sign'

const AZURE_CLIENT_ID     = process.env.AZURE_CLIENT_ID!
const AZURE_CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET!
const AZURE_TENANT_ID     = process.env.AZURE_TENANT_ID!
const SENDER_EMAIL        = process.env.FEDEX_EMAIL || 'ichiro@kingcapitalgrp.com'

const ACK = 'Hello API Event Received'

function getSb() {
  return createClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iprxetnntchgsekdbyon.supabase.co',
    process.env.SUPABASE_SERVICE_KEY!
  )
}

async function getGraphToken(): Promise<string> {
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: AZURE_CLIENT_ID,
    client_secret: AZURE_CLIENT_SECRET,
    scope: 'https://graph.microsoft.com/.default',
  })
  const res = await fetch(
    `https://login.microsoftonline.com/${AZURE_TENANT_ID}/oauth2/v2.0/token`,
    { method: 'POST', body: params }
  )
  const d = await res.json()
  return d.access_token as string
}

async function sendEmailWithPDF(opts: {
  to: string
  toName: string
  subject: string
  body: string
  pdfBuffer: Buffer
  pdfFilename: string
}) {
  const token = await getGraphToken()
  const message = {
    subject: opts.subject,
    body: { contentType: 'HTML', content: opts.body },
    toRecipients: [{ emailAddress: { address: opts.to, name: opts.toName } }],
    attachments: [
      {
        '@odata.type': '#microsoft.graph.fileAttachment',
        name: opts.pdfFilename,
        contentType: 'application/pdf',
        contentBytes: opts.pdfBuffer.toString('base64'),
      },
    ],
  }
  const res = await fetch(`https://graph.microsoft.com/v1.0/users/${SENDER_EMAIL}/sendMail`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, saveToSentItems: true }),
  })
  if (!res.ok) throw new Error(`Graph sendMail ${res.status}: ${await res.text()}`)
}

export async function POST(req: NextRequest) {
  let body: any
  try {
    // Dropbox Sign sends: application/x-www-form-urlencoded with a `json` field
    const text = await req.text()
    const params = new URLSearchParams(text)
    const jsonStr = params.get('json') || text
    body = JSON.parse(jsonStr)
  } catch {
    return new Response(ACK, { status: 200 })
  }

  const eventType          = body?.event?.event_type as string | undefined
  const signatureRequest   = body?.signature_request
  const signatureRequestId = signatureRequest?.signature_request_id as string | undefined
  const metadata           = signatureRequest?.metadata as Record<string, string> | undefined

  // Always acknowledge first — Dropbox Sign will retry if we don't
  // We do the work async-ish but still respond quickly
  const sb = getSb()

  if (!signatureRequestId || !eventType) {
    return new Response(ACK, { status: 200 })
  }

  // Only act on the final "all signed" event
  if (eventType === 'signature_request_all_signed' || eventType === 'signature_request_signed') {
    // Find submission
    const { data: submission } = await sb
      .from('sf023_submissions')
      .select('*')
      .eq('envelope_id', signatureRequestId)
      .single()

    const requesterEmail = submission?.requester_email || metadata?.requesterEmail || ''
    const requesterName  = submission?.requester_name  || metadata?.requesterName  || 'FedEx Employee'
    const stationName    = submission?.station_name_number || 'Your Station'

    if (!requesterEmail) {
      console.error('SF023 webhook: no requester email for', signatureRequestId)
      return new Response(ACK, { status: 200 })
    }

    // Fetch signed PDF
    let pdfBuffer: Buffer
    try {
      pdfBuffer = await getSignedDocument(signatureRequestId)
    } catch (err: any) {
      console.error('SF023 webhook: failed to fetch signed doc:', err)
      await sb.from('sf023_submissions').update({ status: 'email_error', error_msg: err.message }).eq('envelope_id', signatureRequestId)
      return new Response(ACK, { status: 200 })
    }

    // Email to requester
    try {
      await sendEmailWithPDF({
        to:      requesterEmail,
        toName:  requesterName,
        subject: `SF-023 Signed – ${stationName} – King Capital Transport`,
        body: `
          <p>Hello ${requesterName},</p>
          <p>Your requested <strong>SF-023 Service Provider Notification of Personnel Change</strong>
          for <strong>${stationName}</strong> has been signed and is attached to this email.</p>
          <p>Please retain this document for your records. Questions? Contact us at
          <a href="mailto:info@kingcapitalgrp.com">info@kingcapitalgrp.com</a>.</p>
          <br>
          <p>King Capital Transport</p>
        `.trim(),
        pdfBuffer,
        pdfFilename: `SF-023_${stationName.replace(/[^a-zA-Z0-9]/g, '_')}_signed.pdf`,
      })

      await sb.from('sf023_submissions')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('envelope_id', signatureRequestId)
    } catch (err: any) {
      console.error('SF023 webhook: email failed:', err)
      await sb.from('sf023_submissions').update({ status: 'email_error', error_msg: err.message }).eq('envelope_id', signatureRequestId)
    }

  } else if (eventType === 'signature_request_declined') {
    await sb.from('sf023_submissions').update({ status: 'declined' }).eq('envelope_id', signatureRequestId)
  }

  return new Response(ACK, { status: 200 })
}
