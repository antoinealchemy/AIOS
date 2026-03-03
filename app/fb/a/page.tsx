'use client'

import { useEffect } from 'react'
import * as fbq from '@/lib/fbPixel'
import Script from 'next/script'

export default function AngleAPage() {
  useEffect(() => {
    // PIXEL FACEBOOK - VIEWCONTENT
    setTimeout(() => {
      fbq.event('ViewContent', {
        content_name: 'Landing Page AIOS - Angle A (Volume/Retraitement)'
      })
    }, 500)

    // Charger le script SmartPlayer
    const script = document.createElement('script')
    script.src = 'https://scripts.converteai.net/fd093069-bcee-437c-8ad1-4ad632e6754f/players/699b8a317016a923cccf2012/v4/player.js'
    script.async = true
    document.head.appendChild(script)

    // Calendly event listener pour redirection
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event && e.data.event === 'calendly.event_scheduled') {
        // Rediriger vers la page de confirmation
        window.location.href = '/fb/confirmation'
      }
    }
    window.addEventListener('message', handleCalendlyEvent)

    return () => {
      window.removeEventListener('message', handleCalendlyEvent)
    }
  }, [])

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
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

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
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

        /* Hero Section */
        .hero {
            position: relative;
            padding: 32px 24px 40px;
            overflow: hidden;
            background: #F8F8F8;
            min-height: auto;
            display: flex;
            align-items: center;
        }

        .hero-content {
            position: relative;
            z-index: 10;
            text-align: center;
            max-width: 1100px;
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
            margin-top: 24px;
            margin-bottom: 24px;
            letter-spacing: -0.02em;
        }

        h1 {
            font-size: clamp(32px, 5vw, 56px);
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 16px;
            letter-spacing: -0.03em;
        }

        .gradient-text {
            background: linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .subtitle {
            font-size: clamp(15px, 2.2vw, 22px);
            color: #6C6C6C;
            margin-bottom: 24px;
            line-height: 1.4;
            font-weight: 400;
            letter-spacing: -0.02em;
        }

        /* VSL Container */
        .vsl-container {
            position: relative;
            width: 100%;
            max-width: 900px;
            margin: 0 auto 16px;
            border-radius: 16px;
            overflow: hidden;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }

        .vsl-container * {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }

        vturb-smartplayer {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }

        /* CTA Button */
        .cta-primary {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            padding: 14px 32px;
            background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 500;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 10px 40px rgba(59, 130, 246, 0.3);
            letter-spacing: -0.02em;
            cursor: pointer;
            border: none;
        }

        .cta-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 60px rgba(59, 130, 246, 0.5);
        }

        .cta-large {
            padding: 18px 48px;
            font-size: 26px;
            font-weight: 700;
            animation: subtlePulse 2.5s ease-in-out infinite;
        }

        @keyframes subtlePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.03); }
        }

        .hero-cta {
            margin-bottom: 32px;
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

        /* Calendly Container */
        .calendly-section {
            max-width: 900px;
            margin: 0 auto;
            padding: 0 24px;
        }

        .calendly-inline-widget {
            min-width: 320px;
            height: 700px;
            border-radius: 16px;
            overflow: hidden;
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

        footer a, footer button {
            color: #6C6C6C;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        footer a:hover, footer button:hover {
            color: #3B82F6;
        }

        /* Responsive */
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

            .hero {
                padding: 8px 20px 24px;
            }

            .badge {
                font-size: 12px;
                padding: 6px 14px;
                margin-top: 2px;
                margin-bottom: 16px;
            }

            h1 {
                font-size: 24px;
                margin-bottom: 12px;
            }

            .subtitle {
                margin-bottom: 20px;
                font-size: 16px;
            }

            .cta-primary {
                padding: 12px 24px;
                font-size: 22px;
                gap: 8px;
            }

            .calendly-inline-widget {
                height: 800px;
            }
        }
      `}</style>

    {/* Header */}
    <header>
        <div className="header-content">
            <a href="#" className="logo">
                <img src="/logo.png" alt="AIOS Logo" style={{ height: 40, width: "auto" }} />
            </a>
        </div>
    </header>

    {/* Hero Section */}
    <section className="hero">
        <div className="hero-content">
            <div className="badge">
                Expert-Comptable :
            </div>

            <h1>
                4 000 factures en un week-end.<br />
                <span className="gradient-text">Combien d'heures pour tout retraiter ?</span>
            </h1>

            <p className="subtitle">
                Les cabinets qui automatisent le retraitement gagnent 15h par semaine.
            </p>

            {/* VIDEO */}
            <div className="vsl-container" style={{ marginBottom: '24px' }}>
                <div dangerouslySetInnerHTML={{
                    __html: '<vturb-smartplayer id="vid-699b8a317016a923cccf2012" style="display: block; margin: 0 auto; width: 100%;"></vturb-smartplayer>'
                }} />
            </div>

            {/* BOUTON CTA */}
            <div className="hero-cta" style={{ marginTop: '0px', marginBottom: '16px' }}>
                <a href="#calendly" className="cta-primary cta-large">
                    Prendre RDV
                </a>
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}>
                    <img src="/trust.png" alt="Avis clients" style={{ maxWidth: '160px', width: '100%', height: 'auto' }} />
                </div>
            </div>
        </div>
    </section>

    {/* Calendly Section */}
    <section id="calendly" className="calendly-section" style={{ paddingBottom: '60px' }}>
        <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/antoinealchemy/presentation?hide_event_type_details=1&hide_gdpr_banner=1"
        />
    </section>

    {/* Footer */}
    <footer>
        <div className="footer-bottom">
            <p style={{ fontWeight: 600, marginBottom: 16 }}>Copyright © 2025 by AIOS</p>
            <p style={{ marginBottom: 24 }}>
                Ce site ne fait pas partie du site Web de Facebook™ ou de Facebook™ Inc. FACEBOOK™ est une marque de commerce de FACEBOOK™, Inc.
            </p>

            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '14px' }}>
                <a href="/legal/mentions-legales">Mentions Légales</a>
                <a href="/legal/confidentialite">Confidentialité</a>
            </div>
        </div>
    </footer>
    </>
  )
}
