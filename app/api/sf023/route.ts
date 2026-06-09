/**
 * POST /api/sf023
 * Receives the SF-023 form submission:
 *  1. Validates fields
 *  2. Logs to Supabase (sf023_submissions)
 *  3. Generates filled PDF (pdf-lib)
 *  4. Sends to Josh via Dropbox Sign for signature
 *  5. Returns success + signature request ID
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { generateSF023PDF, SF023Data } from '@/lib/sf023-pdf'
import { createSF023SignatureRequest } from '@/lib/dropbox-sign'

function getSb() {
  return createClient(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://iprxetnntchgsekdbyon.supabase.co',
    process.env.SUPABASE_SERVICE_KEY!
  )
}

export async function POST(req: NextRequest) {
  let body: Record<string, any>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const {
    date,
    stationNameNumber,
    businessContactName,
    employees,
    reason,
    reasonDetail,
    nonDrivingServices,
    requesterEmail,
    requesterName,
  } = body

  // ── Validation ──────────────────────────────────────────────────────────────
  if (!date || !stationNameNumber || !businessContactName) {
    return NextResponse.json({ error: 'Date, Station, and Business Contact are required.' }, { status: 400 })
  }
  if (!Array.isArray(employees) || employees.length === 0 || !employees[0]?.name) {
    return NextResponse.json({ error: 'At least one employee name is required.' }, { status: 400 })
  }
  if (!['separation', 'no_longer_meets'].includes(reason)) {
    return NextResponse.json({ error: 'Reason is required.' }, { status: 400 })
  }
  if (reason === 'no_longer_meets' && !reasonDetail?.trim()) {
    return NextResponse.json({ error: 'Please provide a reason for "No Longer Meets Terms".' }, { status: 400 })
  }
  if (!requesterEmail || !/^\S+@\S+\.\S+$/.test(requesterEmail)) {
    return NextResponse.json({ error: 'A valid email address is required to receive the completed form.' }, { status: 400 })
  }

  // ── Build form data for PDF ──────────────────────────────────────────────────
  const formData: SF023Data = {
    date,
    stationNameNumber,
    serviceProviderName: 'King Capital Transport',
    businessId:          process.env.KCT_BUSINESS_ID || 'V548',
    authorizedOfficerName: 'Josh Stenson',
    businessContactName,
    employees: (employees as any[]).slice(0, 3).filter((e: any) => e?.name),
    reason,
    reasonDetail:        reasonDetail || '',
    nonDrivingServices:  nonDrivingServices || undefined,
    printName:           'Josh Stenson',
    signatureDate:       '',  // Dropbox Sign fills this in
  }

  // ── Log to Supabase ──────────────────────────────────────────────────────────
  const sb = getSb()
  const { data: logRow, error: logErr } = await sb
    .from('sf023_submissions')
    .insert({
      submitted_at:         new Date().toISOString(),
      date_of_form:         date,
      station_name_number:  stationNameNumber,
      business_contact:     businessContactName,
      employee_names:       employees.map((e: any) => e.name).filter(Boolean),
      reason,
      reason_detail:        reasonDetail || null,
      non_driving_services: nonDrivingServices || null,
      requester_email:      requesterEmail,
      requester_name:       requesterName || '',
      status:               'pending_signature',
    })
    .select('id')
    .single()

  if (logErr) console.error('SF023 Supabase log error:', logErr)

  const submissionId = logRow?.id?.toString() || `tmp-${Date.now()}`

  // ── Generate PDF ─────────────────────────────────────────────────────────────
  let pdfBytes: Uint8Array
  try {
    pdfBytes = await generateSF023PDF(formData)
  } catch (err: any) {
    console.error('SF023 PDF generation error:', err)
    return NextResponse.json({ error: 'Failed to generate PDF. Please try again.' }, { status: 500 })
  }

  // ── Send via Dropbox Sign ────────────────────────────────────────────────────
  const employeeNames = formData.employees.map(e => e.name).join(', ')
  let signatureRequestId: string

  try {
    const result = await createSF023SignatureRequest({
      pdfBytes,
      submissionId,
      requesterEmail,
      requesterName: requesterName || requesterEmail,
      employeeNames,
      stationName: stationNameNumber,
    })
    signatureRequestId = result.signatureRequestId

    if (logRow?.id) {
      await sb.from('sf023_submissions')
        .update({ envelope_id: signatureRequestId })
        .eq('id', logRow.id)
    }
  } catch (err: any) {
    console.error('SF023 Dropbox Sign error:', err)
    if (logRow?.id) {
      await sb.from('sf023_submissions')
        .update({ status: 'sign_error', error_msg: err.message })
        .eq('id', logRow.id)
    }
    return NextResponse.json(
      { error: 'Form saved but the signature request could not be sent. Our team has been notified.' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    success: true,
    message: 'Your request has been submitted. Josh will review and sign — you will receive the completed document by email once signed.',
    signatureRequestId,
  })
}
