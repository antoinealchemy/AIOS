'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import * as fbq from '@/lib/fbPixel'

// Supabase client
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
    // Pixel Facebook
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
      // Insertion dans Supabase
      const { error } = await supabase
        .from('leads_formation')
        .insert([
          {
            prenom: formData.prenom,
            email: formData.email,
            telephone: formData.telephone,
            created_at: new Date().toISOString()
          }
        ])

      if (error) throw error

      // Succès
      setSubmitSuccess(true)
      fbq.event('Lead', {
        content_name: 'Formation Lead Submitted'
      })

      // Redirection après 2 secondes
      setTimeout(() => {
        window.location.href = '/formation-video' // À créer
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
      <style jsx>{`
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

        /* Hero Section */
        .hero {
            min-height: 100vh;
            padding: 120px 24px 80px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            position: relative;
            overflow: hidden;
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
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border-radius: 50px;
            color: #FFFFFF;
            font-weight: 600;
            font-size: 14px;
            letter-spacing: 0.5px;
            margin-bottom: 32px;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .title-desktop,
        .title-mobile {
            font-size: clamp(32px, 5vw, 56px);
            font-weight: 800;
            line-height: 1.15;
            margin-bottom: 24px;
            color: #FFFFFF;
            letter-spacing: -0.03em;
        }

        .title-mobile {
            display: none;
        }

        .gradient-text {
            background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .subtitle {
            font-size: clamp(16px, 2vw, 20px);
            line-height: 1.7;
            margin-bottom: 48px;
            color: rgba(255, 255, 255, 0.95);
            font-weight: 400;
        }

        .subtitle-mobile {
            display: none;
        }

        /* GIF Container */
        .gif-container {
            max-width: 800px;
            margin: 0 auto 40px;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            cursor: pointer;
            transition: transform 0.3s ease;
            position: relative;
        }

        .gif-container:hover {
            transform: scale(1.02);
        }

        .gif-container img {
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

        .gif-container:hover .play-overlay {
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

        .gif-container:hover .play-button {
            transform: scale(1.1);
        }

        .play-button svg {
            width: 36px;
            height: 36px;
            fill: #667eea;
            margin-left: 4px;
        }

        /* CTA Button */
        .cta-primary {
            display: inline-block;
            padding: 20px 48px;
            background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
            color: #1a1a1a;
            font-weight: 700;
            font-size: 18px;
            border-radius: 12px;
            text-decoration: none;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(254, 243, 199, 0.4);
            cursor: pointer;
            border: none;
        }

        .cta-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(254, 243, 199, 0.6);
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

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
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
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .form-submit {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
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

        /* Mobile Responsive */
        @media (max-width: 768px) {
            .hero {
                padding: 100px 20px 60px;
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
        }
      `}</style>

      <section className="hero">
        <div className="hero-content">
          <div className="badge">
            Formation exclusive :
          </div>

          <h1 className="title-desktop">
            Comment Récupérer Jusqu'à<br />
            <span className="gradient-text">30h/semaine</span> Non Facturable<br />
            Sans Recruter de Junior
          </h1>

          <h1 className="title-mobile">
            Comment Récupérer Jusqu'à<br />
            <span className="gradient-text">30h/semaine</span><br />
            Sans Recruter de Junior
          </h1>

          <p className="subtitle subtitle-desktop">
            Découvrez la méthode exacte utilisée par 50+ cabinets d'avocats<br />
            pour automatiser leur recherche juridique avec l'IA.
          </p>

          <p className="subtitle subtitle-mobile">
            Découvrez la méthode exacte utilisée par 50+ cabinets<br />
            pour automatiser leur recherche juridique avec l'IA.
          </p>

          <div className="gif-container" onClick={handleOpenPopup}>
            <img src="/1.gif" alt="Formation IA pour avocats" />
            <div className="play-overlay">
              <div className="play-button">
                <svg viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>

          <button onClick={handleOpenPopup} className="cta-primary">
            Regarder la formation
          </button>
        </div>
      </section>

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