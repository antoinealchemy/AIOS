import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AIOS - Centralisez Vos Infos Clients',
  description: 'Assistant IA personnalisé pour cabinets de conseil',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}