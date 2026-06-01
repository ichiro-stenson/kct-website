import type { Metadata } from 'next'
import Image from 'next/image'
import { Shield, Eye, BookOpen, Award, ChevronRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Safety | King Capital Transport',
  description: 'Safety is not a slogan at King Capital Transport — it\'s how we operate every single day. Learn about our safety culture, training, and standards.',
}

const pillars = [
  {
    icon: BookOpen,
    title: 'Training & Onboarding',
    desc: 'Every new driver receives comprehensive onboarding before ever getting behind the wheel on a route. We cover vehicle inspection, defensive driving, and company procedures.',
  },
  {
    icon: Eye,
    title: 'VEDR Monitoring',
    desc: 'Our vehicles are equipped with video event data recorders (VEDR) that detect hard braking, lane departure, speeding, and more. Events are reviewed and coached promptly.',
  },
  {
    icon: Shield,
    title: 'Daily Pre-Trip Inspections',
    desc: 'Every driver completes a thorough vehicle inspection before leaving the terminal. Issues are logged and addressed before a truck leaves the lot.',
  },
  {
    icon: Award,
    title: 'Ongoing Coaching',
    desc: 'Safety isn\'t a one-time training. We conduct regular ride-alongs, review VEDR data weekly, and coach drivers on the spot when issues arise.',
  },
]

const commitments = [
  'Zero tolerance for distracted driving',
  'Mandatory 10-hour rest between shifts',
  'Daily vehicle safety inspections',
  'VEDR event review and driver coaching',
  'Regular manager ride-alongs',
  'Driver acknowledgment on all safety events',
  'Fleet maintenance on scheduled cycles',
  'Incident investigation and root cause analysis',
]

export default function SafetyPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-[#0f1e3c] pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=80"
            alt="Safety"
            fill
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1e3c]/80 to-[#0f1e3c]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#f5821f] font-semibold uppercase tracking-widest text-sm mb-3">Safety</p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-5">
            Safety Isn&apos;t a<br />
            <span className="text-[#f5821f]">Slogan Here.</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
            We believe every driver deserves to come home safe every day. That&apos;s not a mission statement — it&apos;s how we run our operation.
          </p>
        </div>
      </section>

      {/* ── Our Approach ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-[#f5821f] font-semibold uppercase tracking-widest text-sm mb-3">Our Approach</p>
              <h2 className="section-heading mb-5">Safety Is Built Into Everything</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                At King Capital Transport, safety isn&apos;t a department — it&apos;s a culture. From the moment a driver starts their morning until they clock out at night, we have systems in place to protect them, the public, and the FedEx network we represent.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use technology, training, and coaching — not just rules — to build drivers who are genuinely safer on the road. That means reviewing data, having real conversations, and following up.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Safety is also one of the key metrics FedEx Ground evaluates us on. We take that seriously and hold ourselves to a high standard.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1590374504354-fb7efdc5a7d3?w=800&q=80"
                  alt="Safe driving"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pillars ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#f5821f] font-semibold uppercase tracking-widest text-sm mb-3">How We Do It</p>
            <h2 className="section-heading mx-auto">Our Safety Program</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {pillars.map(p => (
              <div key={p.title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-[#f5821f]/10 rounded-xl flex items-center justify-center mb-5">
                  <p.icon className="w-6 h-6 text-[#f5821f]" />
                </div>
                <h3 className="font-bold text-[#0f1e3c] text-xl mb-3">{p.title}</h3>
                <p className="text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Commitments ── */}
      <section className="bg-[#0f1e3c] py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#f5821f] font-semibold uppercase tracking-widest text-sm mb-3">Our Standards</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Our Safety Commitments</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {commitments.map(c => (
              <div key={c} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                <CheckCircle className="w-5 h-5 text-[#f5821f] flex-shrink-0" />
                <span className="text-gray-200 text-sm font-medium">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#0f1e3c] mb-4">Work for a Company That Has Your Back</h2>
          <p className="text-gray-500 text-lg mb-8">
            Safety is just one reason drivers choose KCT. See what else we offer.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://apply.kingcapitalgrp.com" className="btn-primary text-lg px-8 py-4">
              Apply Now <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
