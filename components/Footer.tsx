import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Mail } from 'lucide-react'

const locations = [
  { city: 'Springfield', state: 'MO' },
  { city: 'Milwaukee', state: 'WI' },
  { city: 'Madison', state: 'WI' },
  { city: 'Billings', state: 'MT' },
  { city: 'Bismarck', state: 'ND' },
  { city: 'Cody', state: 'WY' },
]

export default function Footer() {
  return (
    <footer className="bg-[#0a1428] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/kct-logo.png" alt="King Capital Transport" width={40} height={40} className="object-contain" />
              <div>
                <div className="text-white font-bold text-base leading-tight">King Capital</div>
                <div className="text-[#f5821f] text-xs font-semibold tracking-widest uppercase">Transport</div>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              FedEx Ground Independent Service Provider. Delivering excellence since 2019.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://www.facebook.com/profile.php?id=100068028046482" target="_blank" rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#f5821f] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="mailto:info@kingcapitalgrp.com"
                className="text-gray-400 hover:text-[#f5821f] transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Home', href: '/' },
                { label: 'About Us', href: '/about' },
                { label: 'Careers', href: '/careers' },
                { label: 'Safety', href: '/safety' },
                { label: 'Contact', href: '/contact' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-[#f5821f] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Our Locations</h3>
            <ul className="space-y-2 text-sm">
              {locations.map(loc => (
                <li key={loc.city} className="flex items-center gap-2 text-gray-400">
                  <MapPin className="w-3.5 h-3.5 text-[#f5821f] flex-shrink-0" />
                  {loc.city}, {loc.state}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Join Our Team</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              We&apos;re always looking for reliable, hardworking drivers. Apply today — no experience required.
            </p>
            <a
              href="https://apply.kingcapitalgrp.com"
              className="inline-block bg-[#f5821f] hover:bg-[#d96e10] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              Apply Now →
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} King Capital Transport. All rights reserved.</span>
          <span>FedEx Ground Independent Service Provider</span>
        </div>
      </div>
    </footer>
  )
}
