'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import * as fbq from '../../lib/fbPixel'

function ConfirmationContent() {
  const searchParams = useSearchParams()

  // Calendly passe ces params si configuré
  const inviteeName = searchParams.get('invitee_full_name') || searchParams.get('name') || ''
  const inviteeEmail = searchParams.get('invitee_email') || searchParams.get('email') || ''
  const eventStartTime = searchParams.get('event_start_time') || ''
  const sessionId = searchParams.get('utm_content') || ''

  useEffect(() => {
    // Pixel Facebook - Event custom "call" pour conversion
    fbq.customEvent('call', {
      content_name: 'RDV Calendly Confirmé',
      value: 100,
      currency: 'EUR'
    })

    // Marquer call_booked = true dans Supabase
    if (sessionId) {
      fetch('/api/leads/booked', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId })
      }).catch(() => {})
    }
  }, [sessionId])

  // Formater la date si présente
  let dateFormatted = ''
  if (eventStartTime) {
    try {
      const date = new Date(eventStartTime)
      dateFormatted = date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (e) {}
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex flex-col">
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Image src="/logo.png" alt="AIOS Logo" width={120} height={40} className="h-10 w-auto" />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-lg text-center shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Rendez-vous confirmé !
          </h1>

          <p className="text-gray-600 mb-6">
            {inviteeName && <>{inviteeName}, votre</>}
            {!inviteeName && <>Votre</>} rendez-vous a bien été réservé.
          </p>

          {dateFormatted && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-600 font-medium">Date du rendez-vous</p>
              <p className="text-lg text-blue-900 font-semibold capitalize">{dateFormatted}</p>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-4 text-left">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Prochaines étapes :</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>1. Vous recevrez un email de confirmation</li>
              <li>2. Un lien de visioconférence vous sera envoyé</li>
              <li>3. Préparez vos questions pour notre échange</li>
            </ul>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            À très bientôt !
          </p>
        </div>
      </main>
    </div>
  )
}

export default function Confirmation1Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50" />}>
      <ConfirmationContent />
    </Suspense>
  )
}
