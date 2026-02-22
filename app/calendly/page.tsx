'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import * as fbq from '../../lib/fbPixel'

function CalendlyContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('sid')
  const [calendlyUrl, setCalendlyUrl] = useState('')

  useEffect(() => {
    fbq.customEvent('CalendlyViewed', {
      content_name: 'Page Calendly'
    })

    // Récupérer les données du formulaire
    const name = searchParams.get('name') || ''
    const email = searchParams.get('email') || ''
    const phone = searchParams.get('a1') || ''

    // Construire l'URL Calendly avec préremplissage
    const calendlyParams = new URLSearchParams()
    if (name) calendlyParams.set('name', name)
    if (email) calendlyParams.set('email', email)
    if (phone) calendlyParams.set('a1', phone)

    setCalendlyUrl(`https://calendly.com/antoinealchemy/presentation?${calendlyParams.toString()}`)

    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Image
            src="/logo.png"
            alt="AIOS Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </div>
      </header>

      <main className="w-full">
        {calendlyUrl && (
          <div
            className="calendly-inline-widget w-full"
            data-url={calendlyUrl}
            style={{ minWidth: '320px', height: 'calc(100vh - 80px)' }}
          />
        )}
      </main>
    </div>
  )
}

export default function CalendlyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50" />}>
      <CalendlyContent />
    </Suspense>
  )
}
