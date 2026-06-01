import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'King Capital Transport | FedEx Ground Delivery Contractor',
  description: 'King Capital Transport is a FedEx Ground Independent Service Provider operating across 6 locations in Missouri, Wisconsin, Montana, North Dakota, and Wyoming. Join our growing team of delivery professionals.',
  keywords: 'King Capital Transport, FedEx Ground, delivery driver jobs, ISP, logistics jobs, Springfield MO, Milwaukee WI, Madison WI, Billings MT, Bismarck ND, Cody WY',
  openGraph: {
    title: 'King Capital Transport | FedEx Ground Delivery Contractor',
    description: 'Delivering excellence across 6 states. Join our team of 300+ delivery professionals.',
    url: 'https://kingcapitalgrp.com',
    siteName: 'King Capital Transport',
    type: 'website',
  },
  metadataBase: new URL('https://kingcapitalgrp.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
