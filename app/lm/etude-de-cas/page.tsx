'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import * as fbq from '@/lib/fbPixel'

export default function EtudeDeCasPage() {

  useEffect(() => {
    // Performance tracking script
    const perfScript = document.createElement('script')
    perfScript.innerHTML = '!function(i,n){i._plt=i._plt||(n&&n.timeOrigin?n.timeOrigin+n.now():Date.now())}(window,performance);'
    document.head.appendChild(perfScript)

    // Preload links
    const preloadPlayer = document.createElement('link')
    preloadPlayer.rel = 'preload'
    preloadPlayer.href = 'https://scripts.converteai.net/fd093069-bcee-437c-8ad1-4ad632e6754f/players/699dd8cf10f8465bfaf7ecb4/v4/player.js'
    preloadPlayer.as = 'script'
    document.head.appendChild(preloadPlayer)

    const preloadSmartplayer = document.createElement('link')
    preloadSmartplayer.rel = 'preload'
    preloadSmartplayer.href = 'https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js'
    preloadSmartplayer.as = 'script'
    document.head.appendChild(preloadSmartplayer)

    // DNS prefetch
    const dnsPrefetchUrls = [
      'https://cdn.converteai.net',
      'https://scripts.converteai.net',
      'https://images.converteai.net',
      'https://api.vturb.com.br'
    ]
    dnsPrefetchUrls.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'dns-prefetch'
      link.href = url
      document.head.appendChild(link)
    })

    // Charger le script SmartPlayer
    const script = document.createElement('script')
    script.src = 'https://scripts.converteai.net/fd093069-bcee-437c-8ad1-4ad632e6754f/players/699dd8cf10f8465bfaf7ecb4/v4/player.js'
    script.async = true
    document.head.appendChild(script)

    // Pixel Facebook - ViewContent
    setTimeout(() => {
      try {
        fbq.event('ViewContent', {
          content_name: 'Etude de cas - Cabinet Avocats - Video'
        })
      } catch (e) {}
    }, 500)

  }, [])

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

        /* Mobile-only line breaks */
        .mobile-br {
            display: inline;
        }

        /* VSL Container */
        .vsl-container {
            position: relative;
            width: 100%;
            max-width: 900px;
            margin: 0 auto;
            border-radius: 16px;
            overflow: hidden;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
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
        .hero-cta {
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

        footer a {
            color: #6C6C6C;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        footer a:hover {
            color: #3B82F6;
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
                font-size: 1.75rem;
                margin-bottom: 16px;
            }

            .mobile-br {
                display: block;
            }

            .subtitle {
                margin-bottom: 32px;
                font-size: 1rem;
            }

            .vsl-container {
                border-radius: 12px;
            }

            .cta-primary {
                padding: 12px 24px;
                font-size: 22px;
                gap: 8px;
            }

            .cta-large {
                padding: 16px 40px;
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
                Étude de cas :
            </div>

            <h1>
                Comment ce cabinet d'avocats<span className="mobile-br" /> parisien a récupéré <span className="gradient-text">12 000€</span><span className="mobile-br" /> grâce à notre système
            </h1>

            <p className="subtitle">
                → 13 heures récupérées par semaine,<span className="mobile-br" /> un nouveau client signé à 12 000€/mois,<span className="mobile-br" /> sans changer d'outil ni embaucher :
            </p>

            {/* VIDEO ETUDE DE CAS */}
            <div className="vsl-container">
                <div dangerouslySetInnerHTML={{
                    __html: '<vturb-smartplayer id="vid-699dd8cf10f8465bfaf7ecb4" style="display: block; margin: 0 auto; width: 100%;"></vturb-smartplayer>'
                }} />
            </div>

            {/* BOUTON CTA */}
            <div className="hero-cta" style={{ marginTop: '32px', marginBottom: '16px' }}>
                <Link href="/lm/qualification" className="cta-primary cta-large">
                    Prendre RDV
                </Link>
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}>
                    <img src="/trust.png" alt="Avis clients" style={{ maxWidth: '160px', width: '100%', height: 'auto' }} />
                </div>
            </div>
        </div>
    </section>

    {/* Footer */}
    <footer>
        <div className="footer-bottom">
            <p style={{ fontWeight: 600, marginBottom: 16 }}>Copyright © 2025 by AIOS</p>
        </div>
    </footer>

    </>
  )
}
