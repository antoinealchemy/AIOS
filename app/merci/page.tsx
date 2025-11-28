'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function MerciPage() {
  const [calendlyUrl, setCalendlyUrl] = useState('https://calendly.com/antoinealchemy/30min')

  useEffect(() => {
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
      
      setCalendlyUrl(`https://calendly.com/antoinealchemy/30min?${params.toString()}`)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
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

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            Merci pour votre intérêt
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 text-center">
            Nous avons bien reçu vos informations.
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
            <p className="text-gray-700 mb-4">
              Votre profil ne correspond pas exactement à nos critères actuels, mais nous aimerions quand même échanger avec vous.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>AIOS est conçu pour :</strong>
            </p>
            <ul className="space-y-2 text-gray-700 ml-4">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Les dirigeants/décisionnaires de structures de services B2B
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Qui gèrent plusieurs clients simultanément
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Avec un budget d&apos;investissement minimum de 1 500€
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Prêts à démarrer rapidement
              </li>
            </ul>
          </div>

          {/* SECTION CALENDLY */}
          <div className="border-t-2 border-gray-200 pt-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Discutons de votre situation
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Si vous pensez qu&apos;AIOS pourrait quand même vous convenir, réservez un appel de 30 minutes avec Antoine.
            </p>

            {/* WIDGET CALENDLY AVEC PRÉ-REMPLISSAGE */}
            <div 
              className="calendly-inline-widget border-2 border-gray-200 rounded-xl overflow-hidden" 
              data-url={calendlyUrl}
              style={{ minWidth: '320px', height: '700px' }}
            />
          </div>

          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-gray-600 mb-2">
              Si votre situation évolue, n&apos;hésitez pas à nous recontacter.
            </p>
            <p className="text-sm text-gray-500">
              Nous vous contacterons si un programme adapté à votre profil devient disponible.
            </p>
          </div>

          <div className="mt-8 text-gray-700 text-center">
            <p className="font-semibold">Bonne continuation,</p>
            <p>Antoine</p>
            <p className="text-sm text-gray-500 mt-2">
              <a href="mailto:contact@ai-os.fr" className="text-blue-600 hover:underline">
                contact@ai-os.fr
              </a>
            </p>
          </div>

        </div>
      </main>
    </div>
  )
}