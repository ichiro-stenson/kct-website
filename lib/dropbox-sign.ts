/**
 * dropbox-sign.ts
 * Dropbox Sign (formerly HelloSign) integration for SF-023.
 * Uses API key auth — simple Basic auth with the key as username, blank password.
 *
 * Required env var:
 *   DROPBOX_SIGN_API_KEY — your Dropbox Sign API key
 *
 * Optional:
 *   JOSH_EMAIL  — defaults to josh@kingcapitalgrp.com
 *   JOSH_NAME   — defaults to Josh Stenson
 *   SF023_WEBHOOK_URL — defaults to https://kingcapitaltransport.com/api/sf023-webhook
 */

const BASE = 'https://api.hellosign.com/v3'

function authHeader(): string {
  const key = process.env.DROPBOX_SIGN_API_KEY!
  return 'Basic ' + Buffer.from(`${key}:`).toString('base64')
}

export interface SignatureRequestResult {
  signatureRequestId: string
  signingUrl?: string   // not used (we rely on email)
}

/**
 * Send the filled SF-023 PDF to Josh for signature via Dropbox Sign.
 * Josh signs via email link; requester is CC'd and receives the completed doc automatically.
 */
export async function createSF023SignatureRequest(opts: {
  pdfBytes: Uint8Array
  submissionId: string
  requesterEmail: string
  requesterName: string
  employeeNames: string
  stationName: string
}): Promise<SignatureRequestResult> {
  const joshEmail  = process.env.JOSH_EMAIL || 'josh@kingcapitalgrp.com'
  const joshName   = process.env.JOSH_NAME  || 'Josh Stenson'
  const webhookUrl = process.env.SF023_WEBHOOK_URL || 'https://kingcapitaltransport.com/api/sf023-webhook'

  // Dropbox Sign uses multipart/form-data
  const form = new FormData()

  // Document
  const blob = new Blob([opts.pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })
  form.append('file[0]', blob, `SF-023_${opts.stationName.replace(/[^a-zA-Z0-9]/g, '_')}_${opts.submissionId}.pdf`)

  // Metadata
  form.append('title', `SF-023 Personnel Change – ${opts.stationName}`)
  form.append('subject', `SF-023 Personnel Change – ${opts.stationName} – ${opts.employeeNames}`)
  form.append('message', `Please review and sign the SF-023 Service Provider Notification of Personnel Change for ${opts.stationName}. Once signed, the completed form will be sent to ${opts.requesterName} automatically.`)

  // Signer: Josh
  form.append('signers[0][email_address]', joshEmail)
  form.append('signers[0][name]', joshName)
  form.append('signers[0][order]', '0')

  // CC: the requester — receives the completed doc automatically
  form.append('cc_email_addresses[0]', opts.requesterEmail)

  // Signature field — place it at the signature line (page 1, bottom area)
  form.append('form_fields_per_document[0][document_index]', '0')
  form.append('form_fields_per_document[0][api_id]', 'authorized_signature')
  form.append('form_fields_per_document[0][type]', 'signature')
  form.append('form_fields_per_document[0][x]', '65')
  form.append('form_fields_per_document[0][y]', '560')
  form.append('form_fields_per_document[0][width]', '200')
  form.append('form_fields_per_document[0][height]', '40')
  form.append('form_fields_per_document[0][page]', '1')
  form.append('form_fields_per_document[0][signer]', '0')
  form.append('form_fields_per_document[0][required]', 'true')

  // Date signed field — next to signature
  form.append('form_fields_per_document[1][document_index]', '0')
  form.append('form_fields_per_document[1][api_id]', 'signature_date')
  form.append('form_fields_per_document[1][type]', 'date_signed')
  form.append('form_fields_per_document[1][x]', '420')
  form.append('form_fields_per_document[1][y]', '560')
  form.append('form_fields_per_document[1][width]', '115')
  form.append('form_fields_per_document[1][height]', '30')
  form.append('form_fields_per_document[1][page]', '1')
  form.append('form_fields_per_document[1][signer]', '0')
  form.append('form_fields_per_document[1][required]', 'true')

  // Webhook for completion notification
  form.append('signing_redirect_url', '')
  form.append('metadata[submissionId]', opts.submissionId)
  form.append('metadata[requesterEmail]', opts.requesterEmail)
  form.append('metadata[requesterName]', opts.requesterName || opts.requesterEmail)

  const res = await fetch(`${BASE}/signature_request/send`, {
    method: 'POST',
    headers: { Authorization: authHeader() },
    body: form,
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Dropbox Sign error ${res.status}: ${err}`)
  }

  const data = await res.json() as {
    signature_request: {
      signature_request_id: string
      signing_url?: string
    }
  }

  // Register webhook callback (idempotent — safe to call every time)
  await ensureWebhook(webhookUrl)

  return {
    signatureRequestId: data.signature_request.signature_request_id,
  }
}

/** Fetch the signed PDF from a completed signature request */
export async function getSignedDocument(signatureRequestId: string): Promise<Buffer> {
  const res = await fetch(
    `${BASE}/signature_request/files/${signatureRequestId}?file_type=pdf`,
    { headers: { Authorization: authHeader() } }
  )
  if (!res.ok) throw new Error(`Dropbox Sign getFiles error ${res.status}: ${await res.text()}`)
  return Buffer.from(await res.arrayBuffer())
}

/** Register the callback URL with Dropbox Sign (safe to call repeatedly) */
async function ensureWebhook(callbackUrl: string): Promise<void> {
  try {
    await fetch(`${BASE}/api_app/`, {
      method: 'GET',
      headers: { Authorization: authHeader() },
    })
    // We use account-level callback — set via API or dashboard
    // POST to /account to set callback_url
    const form = new FormData()
    form.append('callback_url', callbackUrl)
    await fetch(`${BASE}/account`, {
      method: 'POST',
      headers: { Authorization: authHeader() },
      body: form,
    })
  } catch {
    // Non-fatal — webhook can be set manually in Dropbox Sign dashboard
  }
}
