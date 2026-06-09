'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, FileText, CheckCircle2 } from 'lucide-react'

const STATIONS = [
  'Springfield, MO – 658',
  'Milwaukee (Cudahy), WI – 532',
  'Madison, WI – 537',
  'Billings, MT – 590',
  'Bismarck, ND – 585',
  'Cody, WY – 824',
]

interface Employee {
  name: string
  vendorId: string
}

export default function SF023Page() {
  const today = new Date().toISOString().split('T')[0]

  const [date, setDate]                 = useState(today)
  const [station, setStation]           = useState('')
  const [bizContact, setBizContact]     = useState('')
  const [employees, setEmployees]       = useState<Employee[]>([{ name: '', vendorId: '' }])
  const [reason, setReason]             = useState<'separation' | 'no_longer_meets' | ''>('')
  const [reasonDetail, setReasonDetail] = useState('')
  const [nonDriving, setNonDriving]     = useState<'yes' | 'no' | ''>('')
  const [reqEmail, setReqEmail]         = useState('')
  const [reqName, setReqName]           = useState('')
  const [loading, setLoading]           = useState(false)
  const [success, setSuccess]           = useState(false)
  const [error, setError]               = useState('')

  function addEmployee() {
    if (employees.length < 3) setEmployees([...employees, { name: '', vendorId: '' }])
  }

  function updateEmployee(idx: number, field: 'name' | 'vendorId', val: string) {
    const updated = [...employees]
    updated[idx] = { ...updated[idx], [field]: val }
    setEmployees(updated)
  }

  function removeEmployee(idx: number) {
    if (employees.length === 1) return
    setEmployees(employees.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/sf023', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          stationNameNumber: station,
          businessContactName: bizContact,
          employees: employees.filter(e => e.name.trim()),
          reason,
          reasonDetail: reason === 'no_longer_meets' ? reasonDetail : undefined,
          nonDrivingServices: reason === 'no_longer_meets' ? nonDriving : undefined,
          requesterEmail: reqEmail,
          requesterName: reqName,
        }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Something went wrong. Please try again.')
      else setSuccess(true)
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-10 text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#0f1e3c] mb-3">Form Submitted</h2>
          <p className="text-gray-600 text-base leading-relaxed">
            Your SF-023 has been submitted for signature. Josh Stenson will review and sign the document.
          </p>
          <p className="mt-4 text-gray-600 text-base leading-relaxed">
            <strong>You&apos;ll receive the completed, signed form at {reqEmail} within 24 hours.</strong>
          </p>
          <p className="mt-6 text-sm text-gray-400">
            Questions?{' '}
            <a href="mailto:info@kingcapitalgrp.com" className="text-[#E8142D] underline">
              info@kingcapitalgrp.com
            </a>
          </p>
          <Link href="/contact" className="mt-6 inline-block text-[#0f1e3c] font-semibold hover:text-[#E8142D] transition-colors text-sm">
            ← Back to Contact
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-[#0f1e3c] pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</Link>
            <ChevronRight className="w-4 h-4 text-gray-600" />
            <span className="text-gray-300 text-sm">SF-023 Form</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#E8142D]/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-[#E8142D]" />
            </div>
            <div>
              <p className="text-[#E8142D] font-semibold uppercase tracking-widest text-xs mb-1">FedEx Ground Form</p>
              <h1 className="text-3xl font-bold text-white leading-tight">SF-023 Personnel Change Request</h1>
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed max-w-2xl">
            Service Provider Notification of Personnel Change. Complete this form to notify FedEx Ground of an
            employee assignment change. The completed, signed document will be emailed to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Section: Form Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[#0f1e3c] px-6 py-3">
                <h2 className="text-white text-sm font-semibold uppercase tracking-widest">Form Information</h2>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <ReadOnlyField label="Service Provider Name" value="King Capital Transport" />
                  <ReadOnlyField label="Authorized Officer" value="Josh Stenson" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Date <span className="text-[#E8142D]">*</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8142D]/40 focus:border-[#E8142D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Station Name/Number <span className="text-[#E8142D]">*</span>
                    </label>
                    <select
                      value={station}
                      onChange={e => setStation(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8142D]/40 focus:border-[#E8142D] bg-white"
                    >
                      <option value="">Select station…</option>
                      {STATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Business Contact Name <span className="text-[#E8142D]">*</span>
                  </label>
                  <input
                    type="text"
                    value={bizContact}
                    onChange={e => setBizContact(e.target.value)}
                    required
                    placeholder="Terminal manager or business contact name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8142D]/40 focus:border-[#E8142D]"
                  />
                </div>
              </div>
            </div>

            {/* Section: Employees */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[#0f1e3c] px-6 py-3">
                <h2 className="text-white text-sm font-semibold uppercase tracking-widest">
                  Employee(s) to be Removed from Assignment
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-xs text-gray-500">Enter up to 3 employees. At least one is required.</p>
                {employees.map((emp, idx) => (
                  <div key={idx} className="flex gap-3 items-end">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                        Employee {idx + 1} Name {idx === 0 && <span className="text-[#E8142D]">*</span>}
                      </label>
                      <input
                        type="text"
                        value={emp.name}
                        onChange={e => updateEmployee(idx, 'name', e.target.value)}
                        required={idx === 0}
                        placeholder="First Last"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8142D]/40 focus:border-[#E8142D]"
                      />
                    </div>
                    <div className="w-44">
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                        FedEx Vendor ID
                      </label>
                      <input
                        type="text"
                        value={emp.vendorId}
                        onChange={e => updateEmployee(idx, 'vendorId', e.target.value)}
                        placeholder="e.g. 1234567"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8142D]/40 focus:border-[#E8142D]"
                      />
                    </div>
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => removeEmployee(idx)}
                        className="mb-0.5 text-gray-300 hover:text-[#E8142D] text-xl leading-none transition-colors"
                      >✕</button>
                    )}
                  </div>
                ))}
                {employees.length < 3 && (
                  <button
                    type="button"
                    onClick={addEmployee}
                    className="text-[#E8142D] text-sm font-semibold hover:text-red-700 flex items-center gap-1 mt-1"
                  >
                    <span className="text-lg leading-none">+</span> Add another employee
                  </button>
                )}
              </div>
            </div>

            {/* Section: Reason */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[#0f1e3c] px-6 py-3">
                <h2 className="text-white text-sm font-semibold uppercase tracking-widest">Reason for Change</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border border-gray-100 hover:border-[#E8142D]/30 hover:bg-[#E8142D]/5 transition-all">
                    <input
                      type="radio"
                      name="reason"
                      value="separation"
                      checked={reason === 'separation'}
                      onChange={() => setReason('separation')}
                      className="mt-0.5 accent-[#E8142D]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#0f1e3c]">Service Provider Employment Separation</p>
                      <p className="text-xs text-gray-500 mt-0.5">The employee&apos;s employment has been separated. Note: If a service provider terminates an employee, the DOT file may remain active.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border border-gray-100 hover:border-[#E8142D]/30 hover:bg-[#E8142D]/5 transition-all">
                    <input
                      type="radio"
                      name="reason"
                      value="no_longer_meets"
                      checked={reason === 'no_longer_meets'}
                      onChange={() => setReason('no_longer_meets')}
                      className="mt-0.5 accent-[#E8142D]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#0f1e3c]">No Longer Meets Agreement Terms</p>
                      <p className="text-xs text-gray-500 mt-0.5">The employee no longer meets the terms of the Agreement to be assigned to provide Services. Attach any supporting documentation.</p>
                    </div>
                  </label>
                </div>

                {reason === 'no_longer_meets' && (
                  <div className="space-y-4 pt-2 border-t border-gray-100">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                        Reason <span className="text-[#E8142D]">*</span>
                      </label>
                      <textarea
                        value={reasonDetail}
                        onChange={e => setReasonDetail(e.target.value)}
                        required
                        rows={3}
                        placeholder="Describe why the employee no longer meets the Agreement terms…"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8142D]/40 focus:border-[#E8142D] resize-none"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                        Will this employee be assigned to non-driving services (helper/jumper) during this period?
                      </p>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="nonDriving" value="yes" checked={nonDriving === 'yes'} onChange={() => setNonDriving('yes')} className="accent-[#E8142D]" />
                          <span className="text-sm text-gray-700">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="nonDriving" value="no" checked={nonDriving === 'no'} onChange={() => setNonDriving('no')} className="accent-[#E8142D]" />
                          <span className="text-sm text-gray-700">No</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5">Note: FedEx will verify the applicable terms of the Agreement.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section: Delivery */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-[#0f1e3c] px-6 py-3">
                <h2 className="text-white text-sm font-semibold uppercase tracking-widest">Where to Send the Completed Form</h2>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Once Josh signs, the completed SF-023 will be emailed directly to the address you provide below.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Your Name <span className="text-[#E8142D]">*</span>
                    </label>
                    <input
                      type="text"
                      value={reqName}
                      onChange={e => setReqName(e.target.value)}
                      required
                      placeholder="Your full name"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8142D]/40 focus:border-[#E8142D]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Email Address <span className="text-[#E8142D]">*</span>
                    </label>
                    <input
                      type="email"
                      value={reqEmail}
                      onChange={e => setReqEmail(e.target.value)}
                      required
                      placeholder="you@email.com"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8142D]/40 focus:border-[#E8142D]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                ⚠️ {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !reason}
              className="w-full bg-[#E8142D] hover:bg-red-700 disabled:bg-red-300 text-white font-bold py-4 rounded-xl text-base transition-colors shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting…
                </span>
              ) : 'Submit SF-023 Request'}
            </button>

            <p className="text-xs text-center text-gray-400 pb-4">
              By submitting this form, you authorize King Capital Transport to file the SF-023 with FedEx Ground.
              This form will be signed by Josh Stenson (Authorized Officer) and returned to you via email.
            </p>
          </form>
        </div>
      </section>
    </>
  )
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">{label}</label>
      <div className="w-full border border-gray-100 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-500 select-none">
        {value}
      </div>
    </div>
  )
}
