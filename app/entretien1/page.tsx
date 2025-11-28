'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function MerciQualifiePage() {
  const [calendlyUrl, setCalendlyUrl] = useState('https://calendly.com/antoinealchemy/presentation')

  useEffect(() => {
    // PIXEL FACEBOOK - EVENT LEAD
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        value: 2000,
        currency: 'EUR',
        content_name: 'Lead Qualifié AIOS'
      })
    }

    // RÉCUPÉRER LES DONNÉES DU LEAD DEPUIS SESSIONSTORAGE
    const leadData = sessionStorage.getItem('leadData')
    if (leadData) {
      const data = JSON.parse(leadData)
      
      // CONSTRUIRE URL CALENDLY AVEC PRÉ-REMPLISSAGE
      const params = new URLSearchParams({
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        a1: data.phone
      })
      
      setCalendlyUrl(`https://calendly.com/antoinealchemy/presentation?${params.toString()}`)
    }

    // CHARGER SCRIPT CALENDLY
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
      {/* HEADER */}
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

      {/* CALENDLY PLEINE LARGEUR */}
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