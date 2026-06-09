/**
 * docusign.ts
 * DocuSign eSignature integration for SF-023 form.
 * Uses JWT Bearer authentication (service account / server-to-server).
 *
 * Required env vars:
 *   DOCUSIGN_INTEGRATION_KEY   – Your app's Integration Key (client ID)
 *   DOCUSIGN_SECRET_KEY        – RSA private key (PEM format, single line with \n)
 *   DOCUSIGN_ACCOUNT_ID        – Your DocuSign Account GUID
 *   DOCUSIGN_USER_ID           – Josh's DocuSign User GUID
 *   DOCUSIGN_BASE_PATH         – https://na4.docusign.net/restapi  (prod) or demo
 *   JOSH_EMAIL                 – josh@kingcapitalgrp.com
 *   JOSH_NAME                  – Josh Stenson
 *   SF023_WEBHOOK_URL          – Full URL to /api/sf023-webhook (your Vercel domain)
 */

const DOCUSIGN_AUTH_SERVER = process.env.DOCUSIGN_AUTH_SERVER || 'https://account.docusign.com'

interface DocuSignEnvelope {
  envelopeId: string
  uri: string
  statusDateTime: string
  status: string
}

/** Exchange JWT assertion for an access token */
async function getAccessToken(): Promise<string> {
  const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY!
  const userId         = process.env.DOCUSIGN_USER_ID!
  const privateKey     = (process.env.DOCUSIGN_SECRET_KEY || '').replace(/\\n/g, '\n')

  if (!integrationKey || !userId || !privateKey) {
    throw new Error('DocuSign env vars not configured (DOCUSIGN_INTEGRATION_KEY, DOCUSIGN_USER_ID, DOCUSIGN_SECRET_KEY)')
  }

  // Build JWT header + claims
  const now  = Math.floor(Date.now() / 1000)
  const exp  = now + 3600

  const header  = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({
    iss: integrationKey,
    sub: userId,
    aud: DOCUSIGN_AUTH_SERVER.replace('https://', ''),
    iat: now,
    exp,
    scope: 'signature impersonation',
  })).toString('base64url')

  const signingInput = `${header}.${payload}`

  // Sign with RSA private key using Web Crypto
  const encoder = new TextEncoder()
  const keyData = pemToBuffer(privateKey)
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyData,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sigBuffer = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, encoder.encode(signingInput))
  const sig = Buffer.from(sigBuffer).toString('base64url')

  const jwt = `${signingInput}.${sig}`

  // Exchange JWT for access token
  const res = await fetch(`${DOCUSIGN_AUTH_SERVER}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`DocuSign token error ${res.status}: ${err}`)
  }

  const data = await res.json() as { access_token: string }
  return data.access_token
}

/** Convert PEM string to ArrayBuffer (strips header/footer and decodes base64) */
function pemToBuffer(pem: string): ArrayBuffer {
  const base64 = pem
    .replace(/-----BEGIN [^-]+-----/, '')
    .replace(/-----END [^-]+-----/, '')
    .replace(/\s+/g, '')
  const binary = Buffer.from(base64, 'base64')
  return binary.buffer.slice(binary.byteOffset, binary.byteOffset + binary.byteLength) as ArrayBuffer
}

/**
 * Create a DocuSign envelope with the filled SF-023 PDF.
 * Josh is the signer; requester email receives the completed copy.
 */
export async function createSF023Envelope(opts: {
  pdfBytes: Uint8Array
  submissionId: string
  requesterEmail: string
  requesterName: string
  employeeNames: string
  stationName: string
}): Promise<DocuSignEnvelope> {
  const accessToken  = await getAccessToken()
  const accountId    = process.env.DOCUSIGN_ACCOUNT_ID!
  const basePath     = process.env.DOCUSIGN_BASE_PATH || 'https://na4.docusign.net/restapi'
  const joshEmail    = process.env.JOSH_EMAIL || 'josh@kingcapitalgrp.com'
  const joshName     = process.env.JOSH_NAME  || 'Josh Stenson'
  const webhookUrl   = process.env.SF023_WEBHOOK_URL || 'https://apply.kingcapitalgrp.com/api/sf023-webhook'

  const docBase64 = Buffer.from(opts.pdfBytes).toString('base64')

  const envelope = {
    emailSubject: `SF-023 Personnel Change – ${opts.stationName} – ${opts.employeeNames}`,
    emailBlurb: `Please review and sign the attached Service Provider Notification of Personnel Change (SF-023) for ${opts.stationName}.`,
    status: 'sent',

    documents: [
      {
        documentBase64: docBase64,
        name: `SF-023_${opts.stationName.replace(/\s+/g, '_')}_${opts.submissionId}.pdf`,
        fileExtension: 'pdf',
        documentId: '1',
      },
    ],

    recipients: {
      signers: [
        {
          email: joshEmail,
          name: joshName,
          recipientId: '1',
          routingOrder: '1',
          tabs: {
            signHereTabs: [
              {
                // Anchor to the invisible \s1\ text in the PDF
                anchorString: '\\s1\\',
                anchorXOffset: '0',
                anchorYOffset: '0',
                anchorUnits: 'pixels',
                tabLabel: 'AuthorizedSignature',
              },
            ],
            dateSignedTabs: [
              {
                anchorString: '\\s1\\',
                anchorXOffset: '120',
                anchorYOffset: '0',
                anchorUnits: 'pixels',
                tabLabel: 'SignatureDate',
              },
            ],
          },
        },
      ],
      carbonCopies: [
        {
          email: opts.requesterEmail,
          name: opts.requesterName,
          recipientId: '2',
          routingOrder: '2',
          note: 'You will receive a completed copy of the SF-023 once it has been signed.',
        },
      ],
    },

    eventNotifications: [
      {
        url: webhookUrl,
        loggingEnabled: true,
        requireAcknowledgment: true,
        includeCertificateOfCompletion: true,
        includeEnvelopeVoidReason: true,
        includeTimeZone: true,
        includeSenderAccountAsCustomField: true,
        includeDocuments: true,
        envelopeEvents: [
          { envelopeEventStatusCode: 'completed' },
          { envelopeEventStatusCode: 'declined' },
          { envelopeEventStatusCode: 'voided' },
        ],
      },
    ],

    customFields: {
      textCustomFields: [
        { name: 'submissionId', value: opts.submissionId, show: 'false', required: 'false' },
        { name: 'requesterEmail', value: opts.requesterEmail, show: 'false', required: 'false' },
      ],
    },
  }

  const res = await fetch(`${basePath}/v2.1/accounts/${accountId}/envelopes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(envelope),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`DocuSign createEnvelope error ${res.status}: ${err}`)
  }

  return res.json() as Promise<DocuSignEnvelope>
}

/** Fetch the completed signed PDF from a finished envelope */
export async function getSignedDocument(envelopeId: string): Promise<Buffer> {
  const accessToken = await getAccessToken()
  const accountId   = process.env.DOCUSIGN_ACCOUNT_ID!
  const basePath    = process.env.DOCUSIGN_BASE_PATH || 'https://na4.docusign.net/restapi'

  const res = await fetch(
    `${basePath}/v2.1/accounts/${accountId}/envelopes/${envelopeId}/documents/combined`,
    { headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/pdf' } }
  )

  if (!res.ok) throw new Error(`DocuSign getDocument error ${res.status}: ${await res.text()}`)
  return Buffer.from(await res.arrayBuffer())
}
