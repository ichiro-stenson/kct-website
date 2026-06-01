import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, MapPin, Target, Heart, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us | King Capital Transport',
  description: 'Learn about King Capital Transport — a FedEx Ground ISP founded in 2019, operating across 6 locations with 300+ team members.',
}

const values = [
  {
    icon: Target,
    title: 'Accountability',
    desc: 'We own our results — good or bad. Every driver, every manager, every day.',
  },
  {
    icon: Heart,
    title: 'People First',
    desc: 'Our drivers are the business. We invest in training, tools, and a culture that makes people want to stay.',
  },
  {
    icon: Zap,
    title: 'Operational Excellence',
    desc: 'We run a tight ship — on-time, every time. Our customers and FedEx depend on it.',
  },
]

const milestones = [
  { year: '2019', event: 'King Capital Transport founded in Springfield, MO' },
  { year: '2020', event: 'Expanded to Milwaukee, WI' },
  { year: '2021', event: 'Added Madison, WI and Billings, MT' },
  { year: '2022', event: 'Opened Bismarck, ND terminal' },
  { year: '2023', event: 'Launched Cody, WY — 6th location' },
  { year: '2024', event: 'Surpassed 300 team members company-wide' },
]

export default function AboutPage() {
  return (
    <>
      {/* ── Page Hero ── */}
      <section className="relative bg-[#0f1e3c] pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1800&q=80"
            alt="Logistics warehouse"
            fill
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f1e3c]/80 to-[#0f1e3c]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#f5821f] font-semibold uppercase tracking-widest text-sm mb-3">About Us</p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-5">Built From the Ground Up</h1>
          <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">
            We started in Springfield, Missouri in 2019 with a handful of drivers and a belief that great logistics is really about great people.
          </p>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80"
                  alt="Distribution center"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <p className="text-[#f5821f] font-semibold uppercase tracking-widest text-sm mb-3">Our Story</p>
              <h2 className="section-heading mb-5">From One Terminal to Six States</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                King Capital Transport was founded in 2019 by Josh Stenson with one goal: build the kind of delivery company drivers actually want to work for. No revolving door. No "just show up" management. A real operation.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                As a FedEx Ground Independent Service Provider, we manage the full delivery operation — from morning dispatch to evening closeout — across 6 terminals in 5 states. We hire, train, and develop our own people.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Five years later, we&apos;ve grown to 300+ team members and we&apos;re still growing. The fundamentals haven&apos;t changed: take care of your people, deliver on your commitments, and build something you&apos;re proud of.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#f5821f] font-semibold uppercase tracking-widest text-sm mb-3">What Drives Us</p>
            <h2 className="section-heading mx-auto">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="w-14 h-14 bg-[#f5821f]/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <v.icon className="w-7 h-7 text-[#f5821f]" />
                </div>
                <h3 className="font-bold text-[#0f1e3c] text-xl mb-3">{v.title}</h3>
                <p className="text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#f5821f] font-semibold uppercase tracking-widest text-sm mb-3">Our Journey</p>
            <h2 className="section-heading mx-auto">How We&apos;ve Grown</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={i} className="flex items-start gap-6 pl-16 relative">
                  <div className="absolute left-0 w-12 h-12 bg-[#0f1e3c] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <span className="text-[#f5821f] font-bold text-xs">{m.year.slice(2)}</span>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 flex-1 border border-gray-100">
                    <div className="text-[#f5821f] font-bold text-sm mb-1">{m.year}</div>
                    <div className="text-[#0f1e3c] font-medium">{m.event}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Locations ── */}
      <section className="bg-[#0f1e3c] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#f5821f] font-semibold uppercase tracking-widest text-sm mb-3">Where We Are</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">6 Terminals. 5 States.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              ['Springfield', 'Missouri'],
              ['Milwaukee', 'Wisconsin'],
              ['Madison', 'Wisconsin'],
              ['Billings', 'Montana'],
              ['Bismarck', 'North Dakota'],
              ['Cody', 'Wyoming'],
            ].map(([city, state]) => (
              <div key={city} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-4">
                <MapPin className="w-4 h-4 text-[#f5821f] flex-shrink-0" />
                <span className="text-white font-medium">{city}, </span>
                <span className="text-gray-400 text-sm">{state}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#0f1e3c] mb-4">Want to Be Part of the Story?</h2>
          <p className="text-gray-500 text-lg mb-8">We&apos;re always looking for hardworking people to join our team.</p>
          <a href="https://apply.kingcapitalgrp.com" className="btn-primary text-lg px-8 py-4">
            Apply Today <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </>
  )
}
