'use client'

import { useEffect } from 'react'
import Image from 'next/image'

export default function MerciQualifiePage() {
  useEffect(() => {
    // PIXEL FACEBOOK - EVENT LEAD
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        value: 2000,
        currency: 'EUR',
        content_name: 'Lead Qualifié AIOS'
      })
    }

    // CHARGER SCRIPT CALENDLY
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup au démontage
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

      {/* CONTENU */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          
          {/* BADGE SUCCESS */}
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold mb-6">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Vous êtes qualifié !
          </div>

          {/* TITRE */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Félicitations ! 🎉
          </h1>
          
          <p className="text-xl text-gray-700 mb-8">
            Votre profil correspond parfaitement à AIOS.
          </p>

          {/* CE QUI SE PASSE MAINTENANT */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              📅 Réservez votre appel de découverte (30 min)
            </h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start">
                <span className="font-bold text-blue-600 mr-3">1️⃣</span>
                <span>Choisissez un créneau ci-dessous</span>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-blue-600 mr-3">2️⃣</span>
                <span>On analyse votre situation ensemble</span>
              </div>
              <div className="flex items-start">
                <span className="font-bold text-blue-600 mr-3">3️⃣</span>
                <span>Je vous montre comment AIOS peut vous faire gagner 20h+/semaine</span>
              </div>
            </div>
          </div>

          {/* URGENCE */}
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-8">
            <p className="text-sm font-semibold text-orange-800">
              ⚠️ <strong>Important :</strong> Nous ne prenons que 4 entreprises par mois. 
              Il reste 2 places en décembre. Réservez maintenant avant que ce soit complet.
            </p>
          </div>

          {/* CALENDLY WIDGET */}
          <div 
            className="calendly-inline-widget border-2 border-gray-200 rounded-xl overflow-hidden" 
            data-url="https://calendly.com/antoinealchemy/30min"
            style={{ minWidth: '320px', height: '700px' }}
          />

          {/* FOOTER MESSAGE */}
          <div className="mt-8 text-center text-gray-600">
            <p className="text-sm">
              Vous n'avez pas le temps maintenant ? <br />
              Vous recevrez un email avec ce lien dans quelques minutes.
            </p>
          </div>

        </div>
      </main>
    </div>
  )
}