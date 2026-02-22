'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import * as fbq from '../../lib/fbPixel'

export default function CalendlyPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('sid')
  const [calendlyUrl, setCalendlyUrl] = useState('')

  useEffect(() => {
    fbq.customEvent('CalendlyViewed', {
      content_name: 'Page Calendly'
    })

    // Passer session_id à Calendly via utm_content
    const params = new URLSearchParams()
    if (sessionId) {
      params.set('utm_content', sessionId)
    }

    setCalendlyUrl(`https://calendly.com/antoinealchemy/presentation?${params.toString()}`)

    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [sessionId])

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
