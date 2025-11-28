'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Confirmation1Page() {
  const [appointmentData, setAppointmentData] = useState({
    name: 'Antoine Perreault',
    date: '',
    time: '',
    timezone: 'Heure d\'Europe centrale'
  })

  useEffect(() => {
    // RÉCUPÉRER LES DONNÉES DU RDV DEPUIS SESSIONSTORAGE OU URL
    const leadData = sessionStorage.getItem('leadData')
    if (leadData) {
      const data = JSON.parse(leadData)
      setAppointmentData(prev => ({
        ...prev,
        name: `${data.firstName} ${data.lastName}`
      }))
    }

    // RÉCUPÉRER LA DATE/HEURE DEPUIS LES PARAMÈTRES URL CALENDLY
    const urlParams = new URLSearchParams(window.location.search)
    const eventTime = urlParams.get('event_start_time')
    
    if (eventTime) {
      const date = new Date(eventTime)
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }
      const timeOptions: Intl.DateTimeFormatOptions = { 
        hour: '2-digit', 
        minute: '2-digit' 
      }
      
      setAppointmentData(prev => ({
        ...prev,
        date: date.toLocaleDateString('fr-FR', options),
        time: date.toLocaleTimeString('fr-FR', timeOptions)
      }))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* CARD PRINCIPALE */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* PHOTO PROFIL */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
              <Image 
                src="/profile.jpg" 
                alt="Antoine Perreault"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* TITRE AVEC CHECKMARK */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg 
                className="w-5 h-5 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={3} 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Vous avez rendez-vous
            </h1>
          </div>

          {/* SOUS-TITRE */}
          <p className="text-center text-gray-600 mb-8">
            Une invitation a été envoyée à votre adresse email.
          </p>

          {/* CARD DÉTAILS RDV */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Appel avec Antoine
            </h2>

            {/* PERSONNE */}
            <div className="flex items-start gap-3">
              <svg 
                className="w-6 h-6 text-gray-500 mt-1 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <div>
                <p className="text-gray-900 font-medium">{appointmentData.name}</p>
              </div>
            </div>

            {/* DATE ET HEURE */}
            <div className="flex items-start gap-3">
              <svg 
                className="w-6 h-6 text-gray-500 mt-1 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="text-gray-900 font-medium">
                  {appointmentData.time || '16:30 - 17:00'}
                </p>
                <p className="text-gray-600 text-sm">
                  {appointmentData.date || 'samedi, 29 novembre 2025'}
                </p>
              </div>
            </div>

            {/* FUSEAU HORAIRE */}
            <div className="flex items-start gap-3">
              <svg 
                className="w-6 h-6 text-gray-500 mt-1 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-900">{appointmentData.timezone}</p>
            </div>

            {/* INFO CONFÉRENCE */}
            <div className="flex items-start gap-3">
              <svg 
                className="w-6 h-6 text-gray-500 mt-1 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <p className="text-gray-900">
                Informations sur la conférence en ligne à suivre.
              </p>
            </div>
          </div>

          {/* BOUTON RETOUR (OPTIONNEL) */}
          <div className="mt-8 text-center">
            <a 
              href="/" 
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Retour à l'accueil
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}