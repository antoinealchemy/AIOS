'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import * as fbq from '@/lib/fbPixel'

export default function CapturePage() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ prenom: '', email: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Pixel Facebook - ViewContent
    setTimeout(() => {
      try {
        fbq.event('ViewContent', {
          content_name: 'LM Capture - Etude de cas'
        })
      } catch (e) {}
    }, 500)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.prenom.trim()) {
      alert('Veuillez entrer votre prénom')
      return
    }
    if (!emailRegex.test(formData.email)) {
      alert('Veuillez entrer un email valide')
      return
    }

    setIsSubmitting(true)

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prenom: formData.prenom,
          email: formData.email,
          source: 'lm_capture'
        })
      })

      // Pixel Facebook - Lead
      try {
        fbq.event('Lead', {
          content_name: 'Lead Magnet - Capture',
          value: 0,
          currency: 'EUR'
        })
      } catch (e) {}

      // Redirect to etude-de-cas
      router.push('/lm/etude-de-cas')
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <style jsx global>{`
        html {
            scroll-behavior: smooth;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter Display', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #F8F8F8;
            color: #1a1a1a;
            line-height: 1.6;
            overflow-x: hidden;
            letter-spacing: -0.02em;
            font-weight: 400;
        }

        /* Header */
        header {
            background: #FFFFFF;
            border-bottom: 1px solid #E5E7EB;
            position: sticky;
            top: 0;
            z-index: 1000;
            padding: 16px 0;
        }

        .header-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .logo {
            display: flex;
            align-items: center;
            text-decoration: none;
        }

        .logo img {
            height: 40px;
            width: auto;
            display: block;
        }

        /* Main Section */
        .main-section {
            position: relative;
            padding: 48px 24px 80px;
            overflow: hidden;
            background: #F8F8F8;
            min-height: 90vh;
        }

        .main-content {
            position: relative;
            z-index: 10;
            text-align: center;
            max-width: 900px;
            margin: 0 auto;
            width: 100%;
        }

        .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 14px 28px;
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 50px;
            font-size: 16px;
            font-weight: 500;
            color: #2563EB;
            margin-bottom: 24px;
            letter-spacing: -0.02em;
        }

        h1 {
            font-size: clamp(28px, 4vw, 48px);
            font-weight: 700;
            line-height: 1.15;
            margin-bottom: 20px;
            letter-spacing: -0.03em;
            color: #1a1a1a;
        }

        .gradient-text {
            background: linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .subtitle {
            font-size: clamp(16px, 2vw, 20px);
            color: #6C6C6C;
            margin-bottom: 40px;
            line-height: 1.5;
            font-weight: 400;
            letter-spacing: -0.02em;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
        }

        /* GIF Video Container */
        .video-container {
            position: relative;
            width: 100%;
            max-width: 700px;
            margin: 0 auto;
            border-radius: 16px;
            overflow: hidden;
            cursor: pointer;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .video-container:hover {
            transform: scale(1.02);
            box-shadow: 0 30px 80px rgba(0, 0, 0, 0.2);
        }

        .video-container img {
            width: 100%;
            height: auto;
            display: block;
        }

        .play-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.1);
            transition: background 0.3s ease;
        }

        .video-container:hover .play-overlay {
            background: rgba(0, 0, 0, 0.2);
        }

        .play-button {
            width: 100px;
            height: 100px;
            background: rgba(220, 38, 38, 0.95);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            box-shadow: 0 10px 40px rgba(220, 38, 38, 0.4);
        }

        .video-container:hover .play-button {
            transform: scale(1.1);
            box-shadow: 0 15px 50px rgba(220, 38, 38, 0.5);
        }

        .play-icon {
            width: 0;
            height: 0;
            border-left: 30px solid white;
            border-top: 18px solid transparent;
            border-bottom: 18px solid transparent;
            margin-left: 8px;
        }

        /* Modal */
        .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9999;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .modal-overlay.active {
            display: flex;
        }

        .modal-content {
            background: white;
            border-radius: 24px;
            max-width: 480px;
            width: 100%;
            padding: 48px 40px;
            position: relative;
            box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
            animation: modalFadeIn 0.3s ease;
        }

        @keyframes modalFadeIn {
            from {
                opacity: 0;
                transform: scale(0.95) translateY(20px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        .modal-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #9CA3AF;
            line-height: 1;
            padding: 4px;
            transition: color 0.2s;
        }

        .modal-close:hover {
            color: #1a1a1a;
        }

        .modal-title {
            font-size: 24px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 8px;
            text-align: center;
        }

        .modal-subtitle {
            font-size: 16px;
            color: #6C6C6C;
            margin-bottom: 32px;
            text-align: center;
        }

        .form-group {
            margin-bottom: 16px;
        }

        .form-input {
            width: 100%;
            padding: 16px 20px;
            font-size: 16px;
            border: 2px solid #E5E7EB;
            border-radius: 12px;
            background: #F9FAFB;
            transition: all 0.2s;
            font-family: inherit;
        }

        .form-input:focus {
            outline: none;
            border-color: #3B82F6;
            background: white;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input::placeholder {
            color: #9CA3AF;
        }

        .submit-btn {
            width: 100%;
            padding: 18px 32px;
            background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: 700;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 10px 40px rgba(59, 130, 246, 0.3);
            letter-spacing: 0.02em;
            font-family: inherit;
            margin-top: 8px;
            animation: subtlePulse 2.5s ease-in-out infinite;
        }

        .submit-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 20px 60px rgba(59, 130, 246, 0.5);
        }

        .submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            animation: none;
        }

        @keyframes subtlePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }

        /* Footer */
        footer {
            padding: 48px 24px 60px;
            background: #FFFFFF;
            border-top: 1px solid #E5E7EB;
        }

        .footer-bottom {
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
            color: #6C6C6C;
            font-size: 14px;
            line-height: 1.8;
        }

        .footer-bottom p {
            margin-bottom: 16px;
        }

        @media (max-width: 768px) {
            header {
                padding: 12px 0;
            }

            .header-content {
                padding: 0 16px;
            }

            .logo img {
                height: 28px;
            }

            .main-section {
                padding: 32px 16px 60px;
            }

            .badge {
                font-size: 12px;
                padding: 8px 16px;
                margin-bottom: 16px;
            }

            h1 {
                margin-bottom: 16px;
            }

            .subtitle {
                margin-bottom: 32px;
                font-size: 15px;
            }

            .video-container {
                border-radius: 12px;
            }

            .play-button {
                width: 80px;
                height: 80px;
            }

            .play-icon {
                border-left-width: 24px;
                border-top-width: 14px;
                border-bottom-width: 14px;
                margin-left: 6px;
            }

            .modal-content {
                padding: 32px 24px;
            }

            .modal-title {
                font-size: 20px;
            }
        }
      `}</style>

    {/* Header */}
    <header>
        <div className="header-content">
            <a href="/lm" className="logo">
                <img src="/logo.png" alt="AIOS Logo" style={{ height: 40, width: "auto" }} />
            </a>
        </div>
    </header>

    {/* Main Section */}
    <section className="main-section">
        <div className="main-content">
            <div className="badge">
                Étude de cas
            </div>

            <h1>
                Comment ce cabinet d'avocats parisien a récupéré <span className="gradient-text">12 000€/mois</span> grâce à notre système
            </h1>

            <p className="subtitle">
                Découvrez exactement comment on a implémenté le système, les étapes du déploiement, et les résultats obtenus.
            </p>

            {/* GIF Video */}
            <div className="video-container" onClick={() => setShowModal(true)}>
                <img src="/preview.gif" alt="Aperçu de l'étude de cas" />
                <div className="play-overlay">
                    <div className="play-button">
                        <div className="play-icon"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* Modal Form */}
    <div className={`modal-overlay ${showModal ? 'active' : ''}`} onClick={(e) => {
        if (e.target === e.currentTarget) setShowModal(false)
    }}>
        <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>

            <h2 className="modal-title">Accédez à l'étude de cas</h2>
            <p className="modal-subtitle">Entrez vos informations pour voir la vidéo complète</p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Votre prénom"
                        value={formData.prenom}
                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        className="form-input"
                        placeholder="Votre email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="submit-btn"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'ENVOI EN COURS...' : "RECEVOIR L'ÉTUDE DE CAS"}
                </button>
            </form>
        </div>
    </div>

    {/* Footer */}
    <footer>
        <div className="footer-bottom">
            <p style={{ fontWeight: 600, marginBottom: 16 }}>Copyright © 2025 by AIOS</p>
        </div>
    </footer>

    </>
  )
}
