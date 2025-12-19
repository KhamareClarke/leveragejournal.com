import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import CookieConsent from '@/components/CookieConsent'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://leveragejournal.com'),
  title: 'Leverage Journal™ - 90-Day Transformation System | Goal Setting & Life Planning',
  description: 'Transform your life in 90 days with our scientifically-backed goal setting system. Premium journal + mobile app + proven framework. 94% success rate. 30-day guarantee.',
  keywords: 'goal setting, life planning, transformation, 90-day system, productivity, habit formation, personal development, journal, planner, success',
  authors: [{ name: 'Leverage Journal Team' }],
  creator: 'Leverage Journal™',
  publisher: 'Leverage Journal™',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  themeColor: '#EAB308',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://leveragejournal.com',
    siteName: 'Leverage Journal™',
    title: 'Leverage Journal™ - 90-Day Transformation System',
    description: 'Transform your life in 90 days with our scientifically-backed goal setting system. 94% success rate. 30-day guarantee.',
    images: [
      {
        url: 'https://leveragejournal.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Leverage Journal - 90-Day Transformation System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@LeverageJournal',
    creator: '@LeverageJournal',
    title: 'Leverage Journal™ - 90-Day Transformation System',
    description: 'Transform your life in 90 days with our scientifically-backed goal setting system. 94% success rate.',
    images: ['https://leveragejournal.com/twitter-image.jpg'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Leverage Journal™'
  },
  icons: {
    icon: '/images/logo.svg',
    shortcut: '/images/logo.svg',
    apple: '/images/logo.svg',
  },
  alternates: {
    canonical: 'https://leveragejournal.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#EAB308" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Leverage Journal™" />
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        
        {/* Structured Data Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "Leverage Journal™ - 90-Day Transformation System",
              "description": "Transform your life in 90 days with our scientifically-backed goal setting system. Premium journal + mobile app + proven framework.",
              "brand": {
                "@type": "Brand",
                "name": "Leverage Journal™"
              },
              "offers": {
                "@type": "Offer",
                "price": "19.99",
                "priceCurrency": "GBP",
                "availability": "https://schema.org/PreOrder",
                "validFrom": "2024-11-08"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "10000",
                "bestRating": "5",
                "worstRating": "1"
              },
              "manufacturer": {
                "@type": "Organization",
                "name": "Leverage Journal™",
                "url": "https://leveragejournal.com"
              }
            })
          }}
        />
        
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Leverage Journal™",
              "url": "https://leveragejournal.com",
              "logo": "https://leveragejournal.com/logo.png",
              "description": "90-day transformation system for goal setting and personal development",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+44-20-7946-0958",
                "contactType": "Customer Service",
                "email": "support@leveragejournal.com"
              },
              "sameAs": [
                "https://twitter.com/LeverageJournal",
                "https://facebook.com/LeverageJournal",
                "https://instagram.com/LeverageJournal"
              ]
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <ServiceWorkerRegistration />
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  )
}
