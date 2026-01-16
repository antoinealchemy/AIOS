'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import * as fbq from '@/lib/fbPixel'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function OptinPage() {
  const [showPopup, setShowPopup] = useState(false)
  const [formData, setFormData] = useState({
    prenom: '',
    email: '',
    telephone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      fbq.event('ViewContent', {
        content_name: 'Page Optin Formation'
      })
    }, 500)
  }, [])

  const handleOpenPopup = () => {
    setShowPopup(true)
    fbq.event('InitiateCheckout', {
      content_name: 'Popup Optin Opened'
    })
  }

  const handleClosePopup = () => {
    setShowPopup(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id, email')
        .eq('email', formData.email)
        .single()

      if (existingLead) {
        const { error } = await supabase
          .from('leads')
          .update({
            optin_completed: true,
            optin_source: 'formation',
            updated_at: new Date().toISOString()
          })
          .eq('email', formData.email)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('leads')
          .insert([
            {
              email: formData.email,
              first_name: formData.prenom,
              phone: formData.telephone,
              optin_completed: true,
              optin_source: 'formation',
              form_completed: false,
              created_at: new Date().toISOString()
            }
          ])

        if (error) throw error
      }

      setSubmitSuccess(true)
      fbq.event('Lead', {
        content_name: 'Formation Optin Completed'
      })

      setTimeout(() => {
        window.location.href = '/formation'
      }, 2000)

    } catch (error) {
      console.error('Erreur Supabase:', error)
      alert('Erreur lors de l\'envoi. Réessayez.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <style jsx global>{`
        /* Reprise du CSS de la landing principale */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter Display', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          background: #FFFFFF;
          overflow-x: hidden;
        }

        /* Header */
        header {
          background: white;
          border-bottom: 1px solid #E5E7EB;
          padding: 16px 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .logo img {
          height: 40px;
          width: auto;
        }

        /* Hero Section */
        .hero {
          min-height: 100vh;
          padding: 80px 24px 80px;
          background: linear-gradient(135deg, #EFF6FF 0%, #ECFEFF 100%);
          position: relative;
          overflow: hidden;
        }

        /* Floating Icons */
        .floating-icon {
          position: absolute;
          width: 80px;
          height: 80px;
          opacity: 0.15;
          animation: float 6s ease-in-out infinite;
        }

        .icon-1 { top: 15%; left: 10%; animation-delay: 0s; }
        .icon-2 { top: 25%; right: 15%; animation-delay: 1s; }
        .icon-3 { bottom: 30%; left: 8%; animation-delay: 2s; }
        .icon-4 { bottom: 20%; right: 10%; animation-delay: 3s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(5deg); }
          66% { transform: translateY(20px) rotate(-5deg); }
        }

        .hero-content {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
          text-align: center;
        }

        .badge {
          display: inline-block;
          padding: 12px 24px;
          background: rgba(59, 130, 246, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 50px;
          color: #3B82F6;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.5px;
          margin-bottom: 32px;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }

        h1 {
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 24px;
          color: #1a1a1a;
          letter-spacing: -0.03em;
        }

        .title-mobile {
          display: none;
        }

        .gradient-text {
          background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          font-size: clamp(16px, 2vw, 20px);
          line-height: 1.7;
          margin-bottom: 48px;
          color: #4a4a4a;
          font-weight: 400;
        }

        .subtitle-mobile {
          display: none;
        }

        /* GIF Container */
        .vsl-container {
          max-width: 800px;
          margin: 0 auto 40px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          cursor: pointer;
          transition: transform 0.3s ease;
          position: relative;
        }

        .vsl-container:hover {
          transform: scale(1.02);
        }

        .vsl-container img {
          width: 100%;
          height: auto;
          display: block;
        }

        .play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.2);
          transition: background 0.3s ease;
        }

        .vsl-container:hover .play-overlay {
          background: rgba(0, 0, 0, 0.3);
        }

        .play-button {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transition: transform 0.3s ease;
        }

        .vsl-container:hover .play-button {
          transform: scale(1.1);
        }

        .play-button svg {
          width: 36px;
          height: 36px;
          fill: #3B82F6;
          margin-left: 4px;
        }

        /* CTA Button */
        .cta-primary {
          display: inline-block;
          padding: 20px 48px;
          background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
          color: #FFFFFF;
          font-weight: 700;
          font-size: 18px;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
          cursor: pointer;
          border: none;
        }

        .cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(59, 130, 246, 0.4);
        }

        .hero-cta {
          margin-bottom: 48px;
          animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Popup Modal */
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        .popup-content {
          background: white;
          border-radius: 20px;
          padding: 48px;
          max-width: 500px;
          width: 100%;
          position: relative;
          animation: slideUp 0.3s ease;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .popup-close {
          position: absolute;
          top: 20px;
          right: 20px;
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #666;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .popup-close:hover {
          background: #f3f4f6;
          color: #1a1a1a;
        }

        .popup-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 12px;
          color: #1a1a1a;
          text-align: center;
        }

        .popup-subtitle {
          font-size: 16px;
          color: #666;
          margin-bottom: 32px;
          text-align: center;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1a1a1a;
          font-size: 14px;
        }

        .form-input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 16px;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-input:focus {
          outline: none;
          border-color: #3B82F6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .form-submit {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
          color: white;
          font-weight: 700;
          font-size: 18px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
        }

        .form-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
        }

        .form-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .success-message {
          text-align: center;
          padding: 40px 20px;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }

        .success-icon svg {
          width: 40px;
          height: 40px;
          stroke: white;
        }

        .success-title {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 12px;
        }

        .success-text {
          font-size: 16px;
          color: #666;
        }

        /* Footer */
        footer {
          background: #1a1a1a;
          color: #A0A0A0;
          padding: 48px 24px;
        }

        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .footer-bottom p {
          font-size: 14px;
          line-height: 1.6;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .hero {
            padding: 60px 20px 60px;
          }

          .title-desktop {
            display: none;
          }

          .title-mobile {
            display: block;
          }

          .subtitle-desktop {
            display: none;
          }

          .subtitle-mobile {
            display: block;
          }

          .popup-content {
            padding: 32px 24px;
          }

          .popup-title {
            font-size: 24px;
          }

          .play-button {
            width: 60px;
            height: 60px;
          }

          .play-button svg {
            width: 28px;
            height: 28px;
          }

          .floating-icon {
            width: 60px;
            height: 60px;
          }
        }
      `}</style>

      {/* Header */}
      <header>
        <div className="header-content">
          <a href="/" className="logo">
            <img src="/logo.png" alt="AIOS Logo" />
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        {/* Floating Icons */}
        <div className="floating-icon icon-1">
          <svg fill="none" stroke="url(#gradient1)" viewBox="0 0 24 24">
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
        </div>

        <div className="floating-icon icon-2">
          <svg fill="none" stroke="url(#gradient2)" viewBox="0 0 24 24">
            <defs>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>

        <div className="floating-icon icon-3">
          <svg fill="none" stroke="url(#gradient3)" viewBox="0 0 24 24">
            <defs>
              <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>

        <div className="floating-icon icon-4">
          <svg fill="none" stroke="url(#gradient4)" viewBox="0 0 24 24">
            <defs>
              <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>

        <div className="hero-content">
          <div className="badge">
            Cabinets d'avocats :
          </div>

          <h1 className="title-desktop">
            Comment Récupérer Jusqu'à<br />
            <span className="gradient-text">30h/semaine</span> Non Facturable<br />
            Sans Recruter de Junior
          </h1>

          <h1 className="title-mobile">
            Comment Récupérer Jusqu'à<br />
            <span className="gradient-text">40h/semaine</span> Non Facturable<br />
            Sans Recruter de Junior
          </h1>

          <p className="subtitle subtitle-desktop">
            Transformez 45 minutes de recherche juridique en 8 secondes de réponse<br />
            grâce à un assistant IA qui connaît votre documentation par cœur.
          </p>

          <p className="subtitle subtitle-mobile">
            Transformez 45 minutes de recherche juridique<br />
            en 8 secondes de réponse grâce à un assistant IA<br />
            qui connaît votre documentation par cœur.
          </p>

          <div className="vsl-container" onClick={handleOpenPopup}>
            <img src="/1.gif" alt="Formation IA pour avocats" />
            <div className="play-overlay">
              <div className="play-button">
                <svg viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="hero-cta">
            <button onClick={handleOpenPopup} className="cta-primary">
              Accéder à la formation gratuite
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-bottom">
          <p style={{ fontWeight: 600, marginBottom: 16 }}>Copyright © 2025 by AIOS</p>
          <p style={{ marginBottom: 24 }}>
            Ce site ne fait pas partie du site Web de Facebook™ ou de Facebook™ Inc. FACEBOOK™ est une marque de commerce de FACEBOOK™, Inc.
          </p>
        </div>
      </footer>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={handleClosePopup}>
              ×
            </button>

            {!submitSuccess ? (
              <>
                <h2 className="popup-title">Accédez à la formation</h2>
                <p className="popup-subtitle">
                  Entrez vos coordonnées pour regarder la vidéo complète
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Prénom *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Votre prénom"
                      required
                      value={formData.prenom}
                      onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="votre@email.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Téléphone *</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="06 12 34 56 78"
                      required
                      value={formData.telephone}
                      onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                    />
                  </div>

                  <button type="submit" className="form-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Envoi en cours...' : 'Accéder à la formation'}
                  </button>
                </form>
              </>
            ) : (
              <div className="success-message">
                <div className="success-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h3 className="success-title">Merci !</h3>
                <p className="success-text">
                  Redirection vers la formation en cours...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}