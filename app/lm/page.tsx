'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import * as fbq from '@/lib/fbPixel'

export default function LeadMagnetPage() {

  useEffect(() => {
    // Pixel Facebook - ViewContent
    setTimeout(() => {
      fbq.event('ViewContent', {
        content_name: 'Landing Page AIOS - Lead Magnet'
      })
    }, 500)

    // Performance tracking
    const perfScript = document.createElement('script')
    perfScript.innerHTML = '!function(i,n){i._plt=i._plt||(n&&n.timeOrigin?n.timeOrigin+n.now():Date.now())}(window,performance);'
    document.head.appendChild(perfScript)

    // Preload links
    const preloads = [
      { href: 'https://scripts.converteai.net/fd093069-bcee-437c-8ad1-4ad632e6754f/players/699dde1ba036c88a251ce5f7/v4/player.js', as: 'script' },
      { href: 'https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js', as: 'script' },
      { href: 'https://cdn.converteai.net/fd093069-bcee-437c-8ad1-4ad632e6754f/699dd8d148d2f9414f0eecf3/main.m3u8', as: 'fetch' }
    ]
    preloads.forEach(({ href, as }) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = href
      link.as = as
      document.head.appendChild(link)
    })

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
    script.src = 'https://scripts.converteai.net/fd093069-bcee-437c-8ad1-4ad632e6754f/players/699dde1ba036c88a251ce5f7/v4/player.js'
    script.async = true
    document.head.appendChild(script)

    // Smooth scroll
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault()
        const href = anchor.getAttribute('href')
        if (!href) return

        const target = document.querySelector(href)
        if (target instanceof HTMLElement) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    })

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

        /* Hero Section */
        .hero {
            position: relative;
            padding: 32px 24px 40px;
            overflow: hidden;
            background: #F8F8F8;
            min-height: 90vh;
            display: flex;
            align-items: center;
        }

        /* Floating Icons */
        .floating-icon {
            position: absolute;
            width: 80px;
            height: 80px;
            background: white;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            z-index: 0;
            will-change: transform;
        }

        .floating-icon svg {
            width: 40px;
            height: 40px;
        }

        /* Positions des icones */
        .icon-1 {
            top: 24%;
            left: 12%;
            animation: floatIcon1 14s ease-in-out infinite;
        }

        .icon-2 {
            top: 24%;
            right: 12%;
            animation: floatIcon2 16s ease-in-out infinite;
        }

        .icon-3 {
            top: 42%;
            left: 12%;
            animation: floatIcon3 15s ease-in-out infinite;
        }

        .icon-4 {
            top: 42%;
            right: 12%;
            animation: floatIcon4 17s ease-in-out infinite;
        }

        @keyframes floatIcon1 {
            0%   { transform: translate3d(-6px, 0, 0) rotate(-4deg) scale(1); }
            25%  { transform: translate3d(4px, -18px, 0) rotate(-1deg) scale(1.06); }
            50%  { transform: translate3d(10px, -28px, 0) rotate(2deg) scale(1.08); }
            75%  { transform: translate3d(2px, -12px, 0) rotate(0deg) scale(1.04); }
            100% { transform: translate3d(-6px, 0, 0) rotate(-4deg) scale(1); }
        }

        @keyframes floatIcon2 {
            0%   { transform: translate3d(6px, 0, 0) rotate(4deg) scale(1); }
            25%  { transform: translate3d(-4px, -20px, 0) rotate(0deg) scale(1.05); }
            50%  { transform: translate3d(-10px, -30px, 0) rotate(-3deg) scale(1.08); }
            75%  { transform: translate3d(-2px, -14px, 0) rotate(1deg) scale(1.04); }
            100% { transform: translate3d(6px, 0, 0) rotate(4deg) scale(1); }
        }

        @keyframes floatIcon3 {
            0%   { transform: translate3d(-4px, 0, 0) rotate(-3deg) scale(1); }
            25%  { transform: translate3d(3px, 18px, 0) rotate(-1deg) scale(1.05); }
            50%  { transform: translate3d(8px, 28px, 0) rotate(2deg) scale(1.08); }
            75%  { transform: translate3d(0px, 12px, 0) rotate(0deg) scale(1.03); }
            100% { transform: translate3d(-4px, 0, 0) rotate(-3deg) scale(1); }
        }

        @keyframes floatIcon4 {
            0%   { transform: translate3d(6px, 0, 0) rotate(3deg) scale(1); }
            25%  { transform: translate3d(-3px, 20px, 0) rotate(0deg) scale(1.05); }
            50%  { transform: translate3d(-10px, 30px, 0) rotate(-2deg) scale(1.08); }
            75%  { transform: translate3d(-1px, 14px, 0) rotate(1deg) scale(1.04); }
            100% { transform: translate3d(6px, 0, 0) rotate(3deg) scale(1); }
        }

        @media (min-width: 1200px) {
            .icon-1,
            .icon-2 {
                top: 16%;
            }

            .icon-3,
            .icon-4 {
                top: 29%;
            }
        }

        @media (max-width: 1024px) {
            .floating-icon {
                width: 50px;
                height: 50px;
            }

            .floating-icon svg {
                width: 24px;
                height: 24px;
            }

            .icon-1 {
                top: 32%;
                left: 3%;
            }

            .icon-2 {
                top: 32%;
                right: 3%;
            }

            .icon-3 {
                top: 52%;
                left: 3%;
            }

            .icon-4 {
                top: 52%;
                right: 3%;
            }
        }

        @media (max-width: 768px) {
            .floating-icon {
                display: none;
            }
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
            font-size: clamp(32px, 5vw, 60px);
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 16px;
            letter-spacing: -0.03em;
        }

        .title-mobile,
        .subtitle-mobile {
            display: none;
        }

        .title-desktop,
        .subtitle-desktop {
            display: block;
        }

        @media (max-width: 768px) {
            .title-mobile,
            .subtitle-mobile {
                display: block;
            }

            .title-desktop,
            .subtitle-desktop {
                display: none;
            }
        }

        .gradient-text {
            background: linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .subtitle {
            font-size: clamp(13px, 2.2vw, 24px);
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
            font-weight: 700;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 10px 40px rgba(59, 130, 246, 0.3);
            letter-spacing: 0.02em;
        }

        .cta-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 60px rgba(59, 130, 246, 0.5);
        }

        .cta-large {
            padding: 18px 48px;
            font-size: 22px;
            font-weight: 700;
            animation: subtlePulse 2.5s ease-in-out infinite;
        }

        @keyframes subtlePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.03); }
        }

        .hero-cta {
            margin-top: 24px;
            margin-bottom: 48px;
            animation: fadeInUp 0.6s ease-out;
        }

        .cta-reassurance {
            margin-top: 12px;
            font-size: 14px;
            color: #6C6C6C;
            font-weight: 400;
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

        @media (max-width: 768px) {
            .hero {
                padding: 48px 16px 12px;
                min-height: auto;
                align-items: flex-start;
            }

            .hero-cta {
                margin-bottom: 16px;
            }

            .vsl-container {
                margin: 0 auto 8px;
            }

            .cta-large {
                padding: 16px 32px;
                font-size: 16px;
            }
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
                margin-bottom: 12px;
            }

            .subtitle {
                margin-bottom: 20px;
                font-size: 16px;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .floating-icon {
                animation: none;
                transform: none;
            }
            .cta-large {
                animation: none;
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
                Entreprise de services :
            </div>

            <h1 className="title-desktop">
                Trouvez n'importe quelle information<br />
                en moins de <span className="gradient-text">20 secondes</span>.
            </h1>

            <h1 className="title-mobile">
                Trouvez n'importe quelle<br />
                information en moins<br />
                de <span className="gradient-text">20 secondes</span>.
            </h1>

            <p className="subtitle subtitle-desktop">
                Découvrez le système sur mesure connecté à toute votre documentation interne.<br />
                Vos équipes posent une question et obtiennent une réponse précise instantanément sans hallucination.
            </p>

            <p className="subtitle subtitle-mobile">
                Découvrez le système sur mesure connecté à toute votre documentation interne. Vos équipes posent une question et obtiennent une réponse précise instantanément sans hallucination.
            </p>

            {/* VIDEO VSL */}
            <div className="vsl-container" style={{ marginBottom: '24px' }}>
                <div dangerouslySetInnerHTML={{
                    __html: '<vturb-smartplayer id="vid-699dde1ba036c88a251ce5f7" style="display: block; margin: 0 auto; width: 100%;"></vturb-smartplayer>'
                }} />
            </div>

            {/* CTA BUTTON - Hidden initially, appears after 60 seconds via pure CSS */}
            <div className="hero-cta" style={{ animation: 'showCTA 0.5s 60s forwards', opacity: 0, pointerEvents: 'none' as const }}>
                <Link href="/lm/capture" className="cta-primary cta-large" onClick={() => fbq.customEvent('CTA_Click_LM', { content_name: 'Landing Page CTA' })}>
                    RECEVOIR L'ÉTUDE DE CAS OFFERTE
                </Link>
                <p className="cta-reassurance">Accès immédiat • 100% gratuit</p>
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

    </>
  )
}
