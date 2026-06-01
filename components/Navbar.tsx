'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Safety', href: '/safety' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0f1e3c] shadow-xl' : 'bg-[#0f1e3c]/95'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/kct-logo.png" alt="King Capital Transport" width={40} height={40} className="object-contain" />
            <div className="hidden sm:block">
              <div className="text-white font-bold text-lg leading-tight">King Capital</div>
              <div className="text-[#E8142D] text-xs font-semibold tracking-widest uppercase">Transport</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="text-gray-300 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="https://apply.kingcapitalgrp.com"
              className="ml-3 bg-[#E8142D] hover:bg-[#C0101F] text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
            >
              Apply Now
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white p-2 rounded-md hover:bg-white/10 transition-colors"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#0f1e3c] border-t border-white/10 px-4 pb-4">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-gray-300 hover:text-white py-3 text-sm font-medium border-b border-white/5"
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://apply.kingcapitalgrp.com"
            className="block mt-3 bg-[#E8142D] hover:bg-[#C0101F] text-white font-semibold px-5 py-3 rounded-lg text-sm text-center transition-colors"
          >
            Apply Now
          </a>
        </div>
      )}
    </nav>
  )
}
