import type { Metadata } from 'next'
import Image from 'next/image'
import { ChevronRight, MapPin, Clock, DollarSign, CheckCircle, Truck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Careers | King Capital Transport — Delivery Driver Jobs',
  description: 'Join King Capital Transport as a delivery driver. Competitive pay, steady routes, and 6 locations in MO, WI, MT, ND, and WY. Apply today — no CDL required.',
}

const perks = [
  'Competitive pay — above market rates',
  'Consistent year-round routes',
  'No CDL required',
  'Paid training provided',
  'Referral bonus program',
  'Uniform provided',
  'Modern, well-maintained fleet',
  'Local management team',
  'Promote-from-within culture',
  'Stable FedEx-backed operation',
]

const openings = [
  {
    title: 'Delivery Driver',
    type: 'Full-Time',
    locations: ['Springfield, MO', 'Milwaukee, WI', 'Madison, WI', 'Billings, MT', 'Bismarck, ND', 'Cody, WY'],
    desc: 'Deliver FedEx Ground packages on assigned routes. Our drivers are the face of our operation and take pride in getting packages to customers on time.',
    requirements: [
      'Valid driver\'s license (non-CDL)',
      'Clean driving record',
      'Ability to lift up to 75 lbs',
      'Reliable and punctual',
      'Customer-focused attitude',
    ],
  },
  {
    title: 'Lead Driver / Senior Driver',
    type: 'Full-Time',
    locations: ['Multiple Locations'],
    desc: 'Experienced drivers who mentor newer team members, assist with training, and serve as a resource for their terminal.',
    requirements: [
      '6+ months driving experience (KCT or similar)',
      'Strong attendance record',
      'Natural leadership ability',
      'Comfort with training others',
    ],
  },
]

const locations = [
  { city: 'Springfield', state: 'MO', description: 'Our founding terminal, operating since 2019.' },
  { city: 'Milwaukee', state: 'WI', description: 'Serving the greater Milwaukee metropolitan area.' },
  { city: 'Madison', state: 'WI', description: "Wisconsin's capital city and surrounding suburbs." },
  { city: 'Billings', state: 'MT', description: "Montana's largest city and surrounding region." },
  { city: 'Bismarck', state: 'ND', description: "North Dakota's capital serving the central corridor." },
  { city: 'Cody', state: 'WY', description: 'Serving the Cody area and surrounding Wyoming communities.' },
]

export default function CareersPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-[#0f1e3c] pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1800&q=80"
            alt="Delivery driver"
            fill
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1e3c]/80 to-[#0f1e3c]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#E8142D] font-semibold uppercase tracking-widest text-sm mb-3">Careers</p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-5">
            Drive With KCT.<br />
            <span className="text-[#E8142D]">Build Something Real.</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl leading-relaxed mb-8">
            We&apos;re not just filling seats. We&apos;re building careers. If you want steady work, competitive pay, and a team that actually cares — you&apos;re in the right place.
          </p>
          <a href="https://apply.kingcapitalgrp.com" className="btn-primary text-lg px-8 py-4">
            Apply in 5 Minutes <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* ── At a Glance ── */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-[#E8142D]/10 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-[#E8142D]" />
              </div>
              <h3 className="font-bold text-[#0f1e3c] text-lg">Competitive Pay</h3>
              <p className="text-gray-500 text-sm">Top-of-market rates with consistent routes and no CDL required.</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-[#E8142D]/10 rounded-2xl flex items-center justify-center">
                <Clock className="w-7 h-7 text-[#E8142D]" />
              </div>
              <h3 className="font-bold text-[#0f1e3c] text-lg">Immediate Start</h3>
              <p className="text-gray-500 text-sm">Positions are open now. Apply today, interview this week.</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-[#E8142D]/10 rounded-2xl flex items-center justify-center">
                <Truck className="w-7 h-7 text-[#E8142D]" />
              </div>
              <h3 className="font-bold text-[#0f1e3c] text-lg">6 Locations</h3>
              <p className="text-gray-500 text-sm">Find an opening near you across 5 states.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Open Positions ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#E8142D] font-semibold uppercase tracking-widest text-sm mb-3">Open Positions</p>
            <h2 className="section-heading mx-auto">Now Hiring</h2>
            <p className="section-sub mx-auto text-center mt-4">Positions available at all 6 locations.</p>
          </div>

          <div className="space-y-6">
            {openings.map(job => (
              <div key={job.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-[#0f1e3c] mb-1">{job.title}</h3>
                      <span className="inline-flex items-center gap-1.5 bg-[#E8142D]/10 text-[#E8142D] text-sm font-semibold px-3 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5" />{job.type}
                      </span>
                    </div>
                    <a href="https://apply.kingcapitalgrp.com" className="btn-primary">
                      Apply Now <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">{job.desc}</p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-[#0f1e3c] mb-3 text-sm uppercase tracking-wide">Requirements</h4>
                      <ul className="space-y-2">
                        {job.requirements.map(r => (
                          <li key={r} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-[#E8142D] mt-0.5 flex-shrink-0" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#0f1e3c] mb-3 text-sm uppercase tracking-wide">Locations Hiring</h4>
                      <ul className="space-y-2">
                        {job.locations.map(l => (
                          <li key={l} className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-[#E8142D] flex-shrink-0" />
                            {l}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Perks ── */}
      <section className="bg-[#0f1e3c] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#E8142D] font-semibold uppercase tracking-widest text-sm mb-3">The Benefits</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">What You Get at KCT</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                <CheckCircle className="w-5 h-5 text-[#E8142D] flex-shrink-0" />
                <span className="text-gray-200 text-sm font-medium">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Locations hiring ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#E8142D] font-semibold uppercase tracking-widest text-sm mb-3">Find Your Terminal</p>
            <h2 className="section-heading mx-auto">Hiring Near You</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map(loc => (
              <div key={loc.city} className="rounded-xl border border-gray-100 p-6 hover:border-[#E8142D]/40 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#E8142D]/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#E8142D]" />
                  </div>
                  <div>
                    <div className="font-bold text-[#0f1e3c]">{loc.city}, {loc.state}</div>
                    <div className="text-xs text-green-600 font-semibold">● Hiring Now</div>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">{loc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Apply CTA ── */}
      <section className="bg-[#E8142D] py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Apply in 5 Minutes</h2>
          <p className="text-white/80 text-xl mb-8">
            Our application is quick and mobile-friendly. Positions fill fast — apply today.
          </p>
          <a href="https://apply.kingcapitalgrp.com" className="inline-flex items-center gap-2 bg-white text-[#E8142D] hover:bg-gray-100 font-bold px-10 py-4 rounded-lg text-lg transition-colors shadow-lg">
            Start Your Application <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </>
  )
}
