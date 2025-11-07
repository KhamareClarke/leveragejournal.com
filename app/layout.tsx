import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import CookieConsent from '@/components/CookieConsent';
import SEOSchemas from '@/components/SEOSchemas';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});
const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
});
const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'], 
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://leveragejournal.com'),
  title: {
    default: 'Leverage Journal™ – Ultimate 90-Day Achievement System | Transform Goals Into Success | Psychology-Backed Planning + AI Insights',
    template: '%s | Leverage Journal™ - The Ultimate Achievement System'
  },
  description: 'Transform your goals into systematic success with the Leverage Journal™. Join 10,000+ achievers using psychology-backed planning + AI insights. 94% success rate. Pre-order £19.99 (50% OFF). Free worldwide shipping. 30-day guarantee.',
  keywords: [
    // Primary Keywords
    'Leverage Journal',
    'goal setting journal',
    'productivity planner',
    '90-day planner',
    'achievement system',
    'goal tracker',
    'success journal',
    'productivity journal',
    'daily planner',
    'habit tracker',
    
    // Long-tail Keywords
    'psychology-backed goal setting',
    'AI-powered productivity planner',
    'systematic goal achievement method',
    'digital journal with app integration',
    'goal setting planner with progress tracking',
    'entrepreneur productivity system 2025',
    'habit formation and goal tracking',
    'business goal planning journal',
    'personal development planner with AI',
    'quarterly goal setting framework',
    'achievement tracking system',
    'goal oriented daily planner',
    'success mindset journal',
    'productivity journal for high achievers',
    'systematic approach to goal setting',
    'goal accountability system',
    'performance tracking journal',
    
    // Semantic Keywords
    'how to set goals effectively',
    'best productivity planner for entrepreneurs',
    '90 day goal setting system',
    'AI powered goal tracking journal',
    'psychology based productivity planner',
    'digital journal with app sync',
    'goal achievement framework',
    'personal transformation system',
    'success planning methodology',
    'mindset and goal alignment',
    'vision to reality system',
    'structured goal planning',
    'measurable goal tracking',
    'accountability partner system',
    'progress visualization tools',
    
    // Location-based
    'productivity planner UK',
    'goal setting journal London',
    'success journal Europe',
    'achievement system worldwide',
    
    // Problem-solving Keywords
    'overcome procrastination',
    'achieve your goals faster',
    'stay motivated and focused',
    'turn dreams into reality',
    'build successful habits',
    'increase productivity naturally',
    'systematic personal growth',
    'consistent goal achievement',
    'breakthrough limiting beliefs',
    'create lasting change'
  ],
  authors: [{ name: 'Leverage Journal Team', url: 'https://leveragejournal.com' }],
  creator: 'Leverage Journal™',
  publisher: 'Leverage Journal™',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: 'productivity',
  classification: 'Business & Productivity',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
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
    title: 'Leverage Journal™ — The Ultimate 90-Day Achievement System | Transform Goals Into Success',
    description: 'Transform your goals into systematic success. The premium journal that bridges vision and execution with AI-powered insights and real-time progress tracking. Join 10,000+ achievers. 94% success rate.',
    images: [
      {
        url: '/images/leverage-og-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Leverage Journal™ - The Ultimate 90-Day Achievement System with Psychology-Backed Planning and AI Insights',
        type: 'image/jpeg',
      },
      {
        url: '/images/leverage-square.jpg',
        width: 1080,
        height: 1080,
        alt: 'Leverage Journal™ Premium Edition - Physical Journal + Mobile App',
        type: 'image/jpeg',
      },
      {
        url: '/images/leverage-product.jpg',
        width: 800,
        height: 600,
        alt: 'Leverage Journal™ Product Showcase - Journal and Mobile App Interface',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@leveragejournal',
    creator: '@leveragejournal',
    title: 'Leverage Journal™ — The Ultimate 90-Day Achievement System',
    description: 'Transform your goals into systematic success. Premium journal + AI app for achievers. 94% success rate. Pre-order £19.99 (50% OFF).',
    images: ['/images/leverage-og-banner.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
      'facebook-domain-verification': 'your-facebook-verification-code',
    },
  },
  alternates: {
    canonical: 'https://leveragejournal.com',
    languages: {
      'en-GB': 'https://leveragejournal.com',
      'en-US': 'https://leveragejournal.com/us',
      'en': 'https://leveragejournal.com',
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { url: '/apple-touch-icon-152x152.png', sizes: '152x152', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#d97706' },
      { rel: 'shortcut icon', url: '/favicon.ico' },
    ],
  },
  manifest: '/manifest.json',
  other: {
    'theme-color': '#000000',
    'color-scheme': 'dark light',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Leverage Journal™',
    'application-name': 'Leverage Journal™',
    'msapplication-TileColor': '#000000',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
      <head>
        {/* Preload Critical Resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/images/hero-bg.webp" as="image" type="image/webp" />
        
        {/* DNS Prefetch for External Resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//connect.facebook.net" />
        
        {/* Preconnect for Critical Third-party Origins */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Critical CSS Inline */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for above-the-fold content */
            .hero-section { min-height: 100vh; }
            .loading-spinner { animation: spin 1s linear infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }
            
            /* Font display optimization */
            @font-face {
              font-family: 'Inter';
              font-display: swap;
              src: url('/fonts/inter-var.woff2') format('woff2');
            }
          `
        }} />
        
        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied'
            });
            gtag('config', 'GA_MEASUREMENT_ID', {
              page_title: document.title,
              page_location: window.location.href
            });
          `
        }} />
      </head>
      <body className="font-inter antialiased">
        {/* Global SEO Schemas */}
        <SEOSchemas page="home" />
        
        <AuthProvider>
          {children}
          <Toaster />
          
          {/* GDPR Cookie Consent */}
          <CookieConsent />
        </AuthProvider>
        
        {/* Service Worker Registration */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registered: ', registration);
                  })
                  .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `
        }} />
      </body>
    </html>
  );
}
