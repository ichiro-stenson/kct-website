/**
 * POST /api/sf023-webhook
 * DocuSign Connect webhook handler.
 * Fires when Josh signs (envelope "completed") or declines/voids.
 * On completion: emails the signed PDF to the original requester.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSignedDocument } from '@/lib/docusign'

const AZURE_CLIENT_ID     = process.env.AZURE_CLIENT_ID!
const AZURE_CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET!
const AZURE_TENANT_ID     = process.env.AZURE_TENANT_ID!
const SENDER_EMAIL        = process.env.FEDEX_EMAIL || 'ichiro@kingcapitalgrp.com'

function getSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

async function getGraphToken() {
  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: AZURE_CLIENT_ID,
    client_secret: AZURE_CLIENT_SECRET,
    scope: 'https://graph.microsoft.com/.default',
  })
  const res = await fetch(`https://login.microsoftonline.com/${AZURE_TENANT_ID}/oauth2/v2.0/token`, {
    method: 'POST', body: params,
  })
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

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Graph sendMail error ${res.status}: ${err}`)
  }
}

export async function POST(req: NextRequest) {
  // DocuSign sends XML or JSON depending on connect settings
  let bodyText: string
  try {
    bodyText = await req.text()
  } catch {
    return NextResponse.json({ error: 'Bad body' }, { status: 400 })
  }

  // Parse envelope status from DocuSign payload
  // DocuSign Connect sends JSON when content-type is application/json
  let envelopeId: string
  let status: string
  let customFields: Record<string, string> = {}

  const contentType = req.headers.get('content-type') || ''

  if (contentType.includes('json')) {
    const payload = JSON.parse(bodyText)
    envelopeId   = payload.envelopeId || payload.EnvelopeId || ''
    status        = (payload.status || payload.Status || '').toLowerCase()

    // Extract custom fields
    const cf = payload.customFields?.textCustomFields || []
    for (const f of cf) {
      customFields[f.name] = f.value
    }
  } else {
    // XML parsing (simple regex approach for reliability)
    envelopeId     = bodyText.match(/<EnvelopeID>([^<]+)<\/EnvelopeID>/i)?.[1] || ''
    status          = (bodyText.match(/<Status>([^<]+)<\/Status>/i)?.[1] || '').toLowerCase()
    let cfMatch: RegExpExecArray | null
    const cfRe = /<TextCustomField>\s*<Name>([^<]+)<\/Name>\s*<Value>([^<]*)<\/Value>/gi
    while ((cfMatch = cfRe.exec(bodyText)) !== null) customFields[cfMatch[1]] = cfMatch[2]
  }

  if (!envelopeId) {
    return NextResponse.json({ error: 'No envelopeId' }, { status: 400 })
  }

  const sb = getSb()

  // Find submission in Supabase
  const { data: submission } = await sb
    .from('sf023_submissions')
    .select('*')
    .eq('envelope_id', envelopeId)
    .single()

  const requesterEmail = submission?.requester_email || customFields.requesterEmail || ''
  const requesterName  = submission?.requester_name  || 'FedEx Employee'
  const stationName    = submission?.station_name_number || 'Your Station'

  if (status === 'completed') {
    // Fetch the signed document
    let pdfBuffer: Buffer
    try {
      pdfBuffer = await getSignedDocument(envelopeId)
    } catch (err: any) {
      console.error('SF023 webhook - failed to fetch signed doc:', err)
      await sb.from('sf023_submissions').update({ status: 'email_error', error_msg: err.message }).eq('envelope_id', envelopeId)
      return NextResponse.json({ error: 'Failed to retrieve signed document' }, { status: 500 })
    }

    // Email completed PDF to requester
    try {
      await sendEmailWithPDF({
        to: requesterEmail,
        toName: requesterName,
        subject: `SF-023 Signed – ${stationName} – King Capital Transport`,
        body: `
          <p>Hello ${requesterName},</p>
          <p>Your requested <strong>SF-023 Service Provider Notification of Personnel Change</strong> 
          for <strong>${stationName}</strong> has been signed and is attached to this email.</p>
          <p>Please retain this document for your records. If you have any questions, 
          contact us at <a href="mailto:ichiro@kingcapitalgrp.com">ichiro@kingcapitalgrp.com</a>.</p>
          <br>
          <p>King Capital Transport</p>
        `.trim(),
        pdfBuffer,
        pdfFilename: `SF-023_${stationName.replace(/[^a-zA-Z0-9]/g, '_')}_signed.pdf`,
      })

      await sb.from('sf023_submissions')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('envelope_id', envelopeId)
    } catch (err: any) {
      console.error('SF023 webhook - email failed:', err)
      await sb.from('sf023_submissions').update({ status: 'email_error', error_msg: err.message }).eq('envelope_id', envelopeId)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

  } else if (status === 'declined') {
    await sb.from('sf023_submissions').update({ status: 'declined' }).eq('envelope_id', envelopeId)
    // Optionally notify requester of decline
  } else if (status === 'voided') {
    await sb.from('sf023_submissions').update({ status: 'voided' }).eq('envelope_id', envelopeId)
  }

  // DocuSign expects a 200 response
  return NextResponse.json({ received: true, envelopeId, status })
}
