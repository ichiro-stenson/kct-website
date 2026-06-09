/**
 * sf023-pdf.ts
 * Generates a filled SF-023 "Service Provider Notification of Personnel Change" PDF
 * using pdf-lib. Matches the official FedEx Ground form layout.
 */

import { PDFDocument, PDFPage, StandardFonts, rgb, RGB } from 'pdf-lib'

export interface SF023Data {
  date: string
  stationNameNumber: string
  serviceProviderName: string
  businessId: string
  authorizedOfficerName: string
  businessContactName: string
  employees: { name: string; vendorId: string }[]
  reason: 'separation' | 'no_longer_meets'
  reasonDetail?: string
  nonDrivingServices?: 'yes' | 'no'
  printName: string
  signatureDate: string
}

const PURPLE = rgb(0.4, 0.0, 0.6)
const BLACK  = rgb(0, 0, 0)
const GRAY   = rgb(0.4, 0.4, 0.4)
const WHITE  = rgb(1, 1, 1)
const LIGHT_PURPLE = rgb(0.93, 0.88, 0.98)

function drawHRule(page: PDFPage, y: number, x1 = 40, x2 = 555) {
  page.drawLine({ start: { x: x1, y }, end: { x: x2, y }, thickness: 0.5, color: GRAY })
}

function drawBox(page: PDFPage, x: number, y: number, w: number, h: number, fill?: RGB) {
  page.drawRectangle({ x, y, width: w, height: h, color: fill ?? LIGHT_PURPLE, borderColor: GRAY, borderWidth: 0.5 })
}

function checkbox(page: PDFPage, x: number, y: number, checked: boolean, font: any) {
  page.drawRectangle({ x, y, width: 10, height: 10, borderColor: BLACK, borderWidth: 1, color: WHITE })
  if (checked) {
    page.drawText('X', { x: x + 1, y: y + 1, size: 9, font, color: BLACK })
  }
}

export async function generateSF023PDF(data: SF023Data): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create()
  const page   = pdfDoc.addPage([612, 792]) // Letter size
  const { height } = page.getSize()

  const fontBold    = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const fontReg     = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)

  function text(str: string, x: number, y: number, size = 9, font = fontReg, color: RGB = BLACK) {
    page.drawText(str, { x, y: height - y, size, font, color })
  }
  function field(val: string, x: number, y: number, maxW = 120, size = 9) {
    drawBox(page, x, height - y - 13, maxW, 13)
    if (val) page.drawText(val, { x: x + 3, y: height - y - 10, size, font: fontReg, color: BLACK })
  }

  let y = 30

  // ── Header bar ──────────────────────────────────────────────────────────────
  page.drawRectangle({ x: 40, y: height - y - 28, width: 515, height: 28, color: PURPLE })
  text('Service Provider Notification of Personnel Change', 48, y + 8, 14, fontBold, WHITE)
  text('SF-023', 480, y + 8, 11, fontBold, WHITE)
  y += 40

  text('Last Update:  27 August 2024', 40, y, 8, fontOblique, GRAY)
  text('To be completed by the service provider authorized officer/business contact at their discretion.', 40, y + 11, 8, fontOblique, GRAY)
  y += 28

  drawHRule(page, height - y)
  y += 8

  // ── Row 1: Date / Station / SP Name / Business ID ───────────────────────────
  text('Date:', 40, y, 8, fontBold)
  field(data.date, 65, y, 70)
  text('Station Name/Number:', 142, y, 8, fontBold)
  field(data.stationNameNumber, 243, y, 90)
  text('Service Provider Name:', 340, y, 8, fontBold)
  field(data.serviceProviderName, 443, y, 110)
  y += 22

  text('Business ID:', 40, y, 8, fontBold)
  field(data.businessId, 90, y, 80)
  text('Authorized Officer Name:', 178, y, 8, fontBold)
  field(data.authorizedOfficerName, 295, y, 115)
  text('Business Contact Name:', 418, y, 8, fontBold)
  field(data.businessContactName, 535 - 112, y, 112)
  y += 28

  drawHRule(page, height - y)
  y += 8

  // ── Section: Employees ──────────────────────────────────────────────────────
  page.drawRectangle({ x: 40, y: height - y - 16, width: 515, height: 16, color: PURPLE })
  text('Service provider employee(s) to no longer be assigned to provide services under the Agreement', 45, y + 2, 8, fontBold, WHITE)
  y += 22

  // Employee rows
  const empDisplay = [...data.employees, { name: '', vendorId: '' }, { name: '', vendorId: '' }].slice(0, 3)
  for (let i = 0; i < 3; i++) {
    const emp = empDisplay[i] || { name: '', vendorId: '' }
    text(`${i + 1}. Name/FedEx Vendor ID:`, 40, y, 8, fontBold)
    field(emp.name, 145, y, 200)
    text('/', 350, y, 9, fontReg)
    field(emp.vendorId, 358, y, 110)
    y += 20
  }
  y += 4

  drawHRule(page, height - y)
  y += 8

  // ── Section: Reason ─────────────────────────────────────────────────────────
  page.drawRectangle({ x: 40, y: height - y - 16, width: 515, height: 16, color: PURPLE })
  text('Reason', 45, y + 2, 8, fontBold, WHITE)
  y += 22

  // Checkbox 1: Employment separation
  checkbox(page, 40, height - y - 1, data.reason === 'separation', fontBold)
  text('Service provider employment separation', 55, y, 9, fontReg)
  text('Note: If a service provider terminates an employee, the DOT file may remain active.', 55, y + 11, 7.5, fontOblique, GRAY)
  y += 28

  // Checkbox 2: No longer meets terms
  checkbox(page, 40, height - y - 1, data.reason === 'no_longer_meets', fontBold)
  text('Service provider employee no longer meets the terms of the Agreement to be assigned to provide', 55, y, 9, fontReg)
  text('Services. Attach any supporting documentation.', 55, y + 11, 9, fontReg)
  y += 24

  text('Reason:', 55, y, 8, fontBold)
  field(data.reasonDetail || '', 90, y, 465)
  y += 22

  // Underline separator
  drawHRule(page, height - y, 55, 555)
  y += 12

  // Non-driving services question
  const questionText = 'Does the service provider plan to assign the employee to provide non-driving services under the Agreement'
  text(questionText, 40, y, 8, fontReg)
  y += 11
  text('(i.e. helper/jumper, etc.) during the period in which the service provider employee does not meet the', 40, y, 8, fontReg)
  y += 11
  text('terms of the Agreement to be assigned by the service provider to operate a vehicle while providing', 40, y, 8, fontReg)
  y += 11
  text('Services under the Agreement?', 40, y, 8, fontReg)
  y += 16

  checkbox(page, 40, height - y - 1, data.nonDrivingServices === 'yes', fontBold)
  text('Yes', 55, y, 9, fontReg)
  checkbox(page, 100, height - y - 1, data.nonDrivingServices === 'no', fontBold)
  text('No', 115, y, 9, fontReg)
  y += 14

  text('Note: FedEx will verify the applicable terms of the Agreement.', 40, y, 7.5, fontOblique, GRAY)
  y += 22

  drawHRule(page, height - y)
  y += 8

  // ── Section: Acknowledgement ─────────────────────────────────────────────────
  page.drawRectangle({ x: 40, y: height - y - 16, width: 515, height: 16, color: PURPLE })
  text('Authorized Officer/Business Contact Acknowledgement', 45, y + 2, 8, fontBold, WHITE)
  y += 22

  const ackText = 'Based on the facts reviewed or provided, service provider provides notice that it is no longer seeking to assign the above referenced'
  const ackText2 = 'service provider employee(s) to provide Services and/or operate a vehicle under the terms of the Agreement.'
  text(ackText, 40, y, 8, fontReg)
  y += 11
  text(ackText2, 40, y, 8, fontReg)
  y += 20

  // Print / Sign / Date row
  text('Print:', 40, y, 8, fontBold)
  field(data.printName, 65, y, 160)
  text('Date:', 400, y, 8, fontBold)
  field(data.signatureDate, 420, y, 115)
  y += 26

  // Signature line — anchor text for DocuSign
  text('Sign:', 40, y, 8, fontBold)
  drawHRule(page, height - y - 2, 65, 350)
  text('\\s1\\', 65, y - 6, 8, fontReg, rgb(1,1,1)) // DocuSign anchor (white/invisible)
  text('Authorized Officer/Business Contact', 65, y + 10, 7.5, fontOblique, GRAY)
  y += 40

  drawHRule(page, height - y)
  y += 8

  // ── Footer ───────────────────────────────────────────────────────────────────
  text('Service Provider Notification of Personnel Change', 40, y, 7, fontOblique, GRAY)
  text('SF-023', 340, y, 7, fontBold, GRAY)
  text('Last Update: 27 August 2024', 420, y, 7, fontOblique, GRAY)

  return pdfDoc.save()
}
