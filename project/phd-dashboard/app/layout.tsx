import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/sidebar'

export const metadata: Metadata = {
  title: 'LELP Research Platform',
  description: 'Location-based Experiential Learning Platform — Traffic Safety Research Dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ marginLeft: 220, flex: 1, minHeight: '100vh', padding: 28, maxWidth: 'calc(100vw - 220px)' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
