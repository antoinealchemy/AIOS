'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import * as fbq from '../../lib/fbPixel'

export default function Entretien1Page() {
  const [calendlyUrl, setCalendlyUrl] = useState('https://calendly.com/antoinealchemy/presentation')

  useEffect(() => {
    // 📊 PIXEL FACEBOOK - ÉVÉNEMENT OPTIONNEL
    fbq.customEvent('CalendlyViewed', {
      content_name: 'Page Calendly - Lead Qualifié'
    })

    const leadData = sessionStorage.getItem('leadData')
    if (leadData) {
      const data = JSON.parse(leadData)
      
      const params = new URLSearchParams({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        a1: data.phone
      })
      
      setCalendlyUrl(`https://calendly.com/antoinealchemy/presentation?${params.toString()}`)
    }

    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

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
        <div 
          className="calendly-inline-widget w-full" 
          data-url={calendlyUrl}
          style={{ minWidth: '320px', height: 'calc(100vh - 80px)' }}
        />
      </main>
    </div>
  )
}