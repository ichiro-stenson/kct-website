import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Shield, TrendingUp, Users, Award, Truck, ChevronRight, Star } from 'lucide-react'

const stats = [
  { value: '300+', label: 'Team Members' },
  { value: '6', label: 'Locations' },
  { value: '2019', label: 'Founded' },
  { value: '5', label: 'States' },
]

const locations = [
  { city: 'Springfield', state: 'MO', code: '658' },
  { city: 'Milwaukee', state: 'WI', code: '532' },
  { city: 'Madison', state: 'WI', code: '537' },
  { city: 'Billings', state: 'MT', code: '590' },
  { city: 'Bismarck', state: 'ND', code: '585' },
  { city: 'Cody', state: 'WY', code: '824' },
]

const benefits = [
  {
    icon: TrendingUp,
    title: 'Competitive Pay',
    desc: 'Top-of-market pay rates with consistent year-round routes.',
  },
  {
    icon: Shield,
    title: 'Safety First Culture',
    desc: 'We invest in training, equipment, and coaching to keep everyone safe.',
  },
  {
    icon: Users,
    title: 'Team Environment',
    desc: 'Local managers who know your name and support your success.',
  },
  {
    icon: Award,
    title: 'Growth Opportunities',
    desc: 'From driver to lead driver to management — we promote from within.',
  },
  {
    icon: Truck,
    title: 'Modern Fleet',
    desc: 'Well-maintained vehicles with GPS and safety technology.',
  },
  {
    icon: Star,
    title: 'Stability',
    desc: 'Year-round work backed by the FedEx Ground network.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center bg-[#0f1e3c] overflow-hidden pt-16">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1800&q=80"
            alt="Delivery truck on highway"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1e3c] via-[#0f1e3c]/90 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#f5821f]/20 border border-[#f5821f]/40 text-[#f5821f] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Truck className="w-4 h-4" />
              FedEx Ground Independent Service Provider
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Deliver More.{' '}
              <span className="text-[#f5821f]">Earn More.</span>
              <br />Grow More.
            </h1>

            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              King Capital Transport is one of the fastest-growing FedEx Ground contractors in the Midwest, with 300+ team members across 6 locations. We&apos;re hiring drivers who want steady work, competitive pay, and a team that has their back.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="https://apply.kingcapitalgrp.com" className="btn-primary text-lg px-8 py-4">
                Apply Now — It&apos;s Free
                <ChevronRight className="w-5 h-5" />
              </a>
              <Link href="/about" className="btn-outline text-lg px-8 py-4">
                Learn More
              </Link>
            </div>

            <p className="text-gray-500 text-sm mt-5">No CDL required • Paid training available • Immediate openings</p>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ── Stats ── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#0f1e3c] mb-1">{s.value}</div>
                <div className="text-gray-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who We Are ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-[#f5821f] font-semibold uppercase tracking-widest text-sm mb-3">Who We Are</p>
              <h2 className="section-heading mb-5">A FedEx Ground Partner You Can Count On</h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                Founded in 2019, King Capital Transport is a FedEx Ground Independent Service Provider (ISP) built on a simple belief: take care of your people and the operation takes care of itself.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                We operate across Missouri, Wisconsin, Montana, North Dakota, and Wyoming — delivering millions of packages a year while building careers for the drivers who make it happen.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 text-[#f5821f] font-semibold hover:gap-3 transition-all">
                Our Story <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80"
                  alt="Delivery driver with packages"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#f5821f] text-white rounded-xl px-6 py-4 shadow-xl">
                <div className="text-3xl font-bold">5+</div>
                <div className="text-sm font-medium opacity-90">Years of Growth</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Work With Us ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#f5821f] font-semibold uppercase tracking-widest text-sm mb-3">Why KCT</p>
            <h2 className="section-heading mx-auto">More Than Just a Driving Job</h2>
            <p className="section-sub mx-auto text-center mt-4">
              We built this company from the ground up. Here&apos;s what that means for you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map(b => (
              <div key={b.title} className="group p-6 rounded-xl border border-gray-100 hover:border-[#f5821f]/30 hover:shadow-lg transition-all duration-200 bg-white">
                <div className="w-12 h-12 bg-[#f5821f]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#f5821f]/20 transition-colors">
                  <b.icon className="w-6 h-6 text-[#f5821f]" />
                </div>
                <h3 className="font-bold text-[#0f1e3c] text-lg mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Locations ── */}
      <section className="bg-[#0f1e3c] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#f5821f] font-semibold uppercase tracking-widest text-sm mb-3">Where We Operate</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">6 Locations. 5 States.</h2>
            <p className="text-gray-400 mt-3 text-lg">Find a terminal near you.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map(loc => (
              <div key={loc.city} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-6 py-5 hover:bg-white/10 hover:border-[#f5821f]/40 transition-all">
                <div className="w-10 h-10 bg-[#f5821f]/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#f5821f]" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">{loc.city}</div>
                  <div className="text-gray-400 text-sm">{loc.state === 'MO' ? 'Missouri' : loc.state === 'WI' ? 'Wisconsin' : loc.state === 'MT' ? 'Montana' : loc.state === 'ND' ? 'North Dakota' : 'Wyoming'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section className="relative bg-[#f5821f] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Image
            src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1800&q=80"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">Ready to Join the Team?</h2>
          <p className="text-white/80 text-xl mb-10">
            Applications take less than 5 minutes. Positions are available now at all 6 locations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://apply.kingcapitalgrp.com" className="inline-flex items-center gap-2 bg-white text-[#f5821f] hover:bg-gray-100 font-bold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg">
              Apply Now <ChevronRight className="w-5 h-5" />
            </a>
            <Link href="/careers" className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-[#f5821f] font-bold px-8 py-4 rounded-lg text-lg transition-colors">
              See Open Positions
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
