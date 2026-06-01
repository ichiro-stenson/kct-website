import type { Metadata } from 'next'
import { MapPin, Mail, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact | King Capital Transport',
  description: 'Get in touch with King Capital Transport. Find our locations across Missouri, Wisconsin, Montana, North Dakota, and Wyoming.',
}

const locations = [
  { city: 'Springfield', state: 'Missouri', code: 'MO', manager: 'Terminal Manager' },
  { city: 'Milwaukee', state: 'Wisconsin', code: 'WI', manager: 'Terminal Manager' },
  { city: 'Madison', state: 'Wisconsin', code: 'WI', manager: 'Terminal Manager' },
  { city: 'Billings', state: 'Montana', code: 'MT', manager: 'Terminal Manager' },
  { city: 'Bismarck', state: 'North Dakota', code: 'ND', manager: 'Terminal Manager' },
  { city: 'Cody', state: 'Wyoming', code: 'WY', manager: 'Terminal Manager' },
]

export default function ContactPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-[#0f1e3c] pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#f5821f] font-semibold uppercase tracking-widest text-sm mb-3">Contact</p>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-5">Get in Touch</h1>
          <p className="text-xl text-gray-300 max-w-xl leading-relaxed">
            Whether you have a question about joining our team or want to learn more about what we do — we&apos;d love to hear from you.
          </p>
        </div>
      </section>

      {/* ── Contact Grid ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-14">
            {/* Left: Contact options */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f1e3c] mb-8">Reach Out</h2>

              <div className="space-y-6">
                {/* Hiring */}
                <div className="p-6 rounded-xl bg-[#f5821f]/5 border border-[#f5821f]/20">
                  <h3 className="font-bold text-[#0f1e3c] text-lg mb-2 flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-[#f5821f]" />
                    Interested in a Job?
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    The fastest way to get started is through our online application. It only takes a few minutes.
                  </p>
                  <a href="https://apply.kingcapitalgrp.com" className="btn-primary">
                    Apply Now →
                  </a>
                </div>

                {/* Email */}
                <div className="p-6 rounded-xl border border-gray-100">
                  <h3 className="font-bold text-[#0f1e3c] text-lg mb-2 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#f5821f]" />
                    General Inquiries
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    For general questions about the company, partnerships, or anything else:
                  </p>
                  <a href="mailto:info@kingcapitalgrp.com" className="text-[#f5821f] font-semibold hover:underline">
                    info@kingcapitalgrp.com
                  </a>
                </div>

                {/* Facebook */}
                <div className="p-6 rounded-xl border border-gray-100">
                  <h3 className="font-bold text-[#0f1e3c] text-lg mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#f5821f]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Follow Us on Facebook
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                    Stay up to date with company news, job openings, and team highlights.
                  </p>
                  <a
                    href="https://www.facebook.com/profile.php?id=100068028046482"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f5821f] font-semibold hover:underline"
                  >
                    King Capital Transport on Facebook →
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Locations */}
            <div>
              <h2 className="text-2xl font-bold text-[#0f1e3c] mb-8">Our Locations</h2>
              <div className="space-y-4">
                {locations.map(loc => (
                  <div key={loc.city} className="flex items-start gap-4 p-5 rounded-xl border border-gray-100 hover:border-[#f5821f]/30 hover:shadow-sm transition-all">
                    <div className="w-10 h-10 bg-[#f5821f]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5 text-[#f5821f]" />
                    </div>
                    <div>
                      <div className="font-bold text-[#0f1e3c]">{loc.city}, {loc.code}</div>
                      <div className="text-gray-500 text-sm">{loc.state}</div>
                      <div className="text-green-600 text-xs font-semibold mt-1">● Hiring Now</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#0f1e3c] mb-4">Ready to Drive with KCT?</h2>
          <p className="text-gray-500 text-lg mb-8">
            Applications are open now at all 6 locations. It only takes 5 minutes.
          </p>
          <a href="https://apply.kingcapitalgrp.com" className="btn-primary text-lg px-8 py-4">
            Apply Today <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </section>
    </>
  )
}
