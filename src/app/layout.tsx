import type { Metadata } from 'next'
import './globals.css'
import { cn } from '@/lib/utils'
import AuthProvider from '@/provider/AuthProvider'

export const metadata: Metadata = {
  title: 'Books and Shack',
  description: 'Discover millions of books from trusted local bookstores.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/images/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/images/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn('h-full antialiased', 'font-sans')}>
      <body className="min-h-full flex flex-col">
        {' '}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
