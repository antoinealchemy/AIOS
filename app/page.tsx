'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import * as fbq from '@/lib/fbPixel'

export default function HomePage() {
  useEffect(() => {
    // 👁️ PIXEL FACEBOOK - VIEWCONTENT
    setTimeout(() => {
      fbq.event('ViewContent', {
        content_name: 'Landing Page AIOS'
      })
    }, 500)

    // VTURB PLAYER SCRIPT
    const vslScript = document.createElement('script')
    vslScript.src = 'https://scripts.converteai.net/c0135ce6-524c-4d83-9601-c2d9acd8de6f/players/6931bb2e77485fe7cdacd26b/v4/player.js'
    vslScript.async = true
    document.head.appendChild(vslScript)

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

    // Burger Menu
    const burgerMenu = document.getElementById('burgerMenu')
    const navMobile = document.getElementById('navMobile')

    if (burgerMenu && navMobile) {
      burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active')
        navMobile.classList.toggle('active')
      })

      document.querySelectorAll('.nav-mobile-links a, .nav-mobile-cta a').forEach(link => {
        link.addEventListener('click', () => {
          burgerMenu.classList.remove('active')
          navMobile.classList.remove('active')
        })
      })

      document.addEventListener('click', (e) => {
        const target = e.target as Node
        if (!burgerMenu.contains(target) && !navMobile.contains(target) && navMobile.classList.contains('active')) {
          burgerMenu.classList.remove('active')
          navMobile.classList.remove('active')
        }
      })
    }
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
            justify-content: space-between;
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

        /* Navigation Desktop */
        .nav-desktop {
            display: flex;
            align-items: center;
            gap: 40px;
        }

        .header-cta {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 24px;
            background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 500;
            font-size: 14px;
            transition: all 0.3s ease;
            white-space: nowrap;
            letter-spacing: -0.02em;
        }

        .header-cta:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        /* Menu Burger */
        .burger-menu {
            display: none;
            flex-direction: column;
            gap: 5px;
            cursor: pointer;
            padding: 8px;
            background: none;
            border: none;
        }

        .burger-line {
            width: 24px;
            height: 2px;
            background: #1a1a1a;
            transition: all 0.3s ease;
        }

        .burger-menu.active .burger-line:nth-child(1) {
            transform: rotate(45deg) translate(6px, 6px);
        }

        .burger-menu.active .burger-line:nth-child(2) {
            opacity: 0;
        }

        .burger-menu.active .burger-line:nth-child(3) {
            transform: rotate(-45deg) translate(6px, -6px);
        }

        /* Navigation Mobile */
        .nav-mobile {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #FFFFFF;
            border-bottom: 1px solid #E5E7EB;
            padding: 0;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease, padding 0.3s ease;
            z-index: 999;
        }

        .nav-mobile.active {
            max-height: 500px;
            padding: 24px;
        }

        .nav-mobile-cta {
            margin-top: 20px;
        }

        .nav-mobile-cta .header-cta {
            width: 100%;
            justify-content: center;
        }

        /* Hero Section */
        .hero {
            position: relative;
            padding: 60px 24px 80px;
            overflow: hidden;
            background: #F8F8F8;
            min-height: 85vh;
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

        /* Positions des icônes */
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

        /* Animations */
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
            .icon-1 {
                top: 18%;
                left: 4%;
            }

            .icon-2 {
                top: 18%;
                right: 4%;
            }

            .icon-3 {
                top: 37%;
                left: 4%;
            }

            .icon-4 {
                top: 37%;
                right: 4%;
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
            padding: 10px 20px;
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 50px;
            font-size: 14px;
            color: #2563EB;
            margin-bottom: 24px;
            letter-spacing: -0.02em;
            font-weight: 500;
        }

        h1 {
            font-size: clamp(32px, 5vw, 64px);
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 24px;
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
            font-size: clamp(16px, 2.5vw, 22px);
            color: #6C6C6C;
            margin-bottom: 40px;
            line-height: 1.5;
            font-weight: 400;
            letter-spacing: -0.02em;
            max-width: 900px;
            margin-left: auto;
            margin-right: auto;
        }

        /* VSL Container */
        .vsl-container {
            position: relative;
            width: 100%;
            max-width: 900px;
            margin: 0 auto 32px;
            border-radius: 16px;
            overflow: hidden;
        }

        /* CTA Button */
        .cta-primary {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            padding: 16px 40px;
            background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 18px;
            transition: all 0.3s ease;
            box-shadow: 0 10px 40px rgba(59, 130, 246, 0.3);
            letter-spacing: -0.02em;
        }

        .cta-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 60px rgba(59, 130, 246, 0.5);
        }

        .cta-subtitle {
            margin-top: 16px;
            font-size: 14px;
            color: #6C6C6C;
            line-height: 1.5;
        }

        .hero-cta {
            margin-bottom: 48px;
        }

        /* Footer */
        footer {
            padding: 48px 24px 60px;
            background: #FFFFFF;
            border-top: 1px solid #E5E7EB;
        }

        .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
        }

        .footer-logo {
            margin-bottom: 24px;
        }

        .footer-logo img {
            height: 48px;
            width: auto;
            margin: 0 auto;
        }

        .footer-separator {
            border: none;
            border-top: 1px solid #E5E7EB;
            margin: 32px 0;
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
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

            .burger-menu {
                display: flex;
                padding: 4px;
            }

            .nav-desktop {
                display: none;
            }

            .nav-mobile {
                display: block;
            }

            .hero {
                padding: 40px 20px 60px;
                min-height: auto;
            }

            .badge {
                font-size: 12px;
                padding: 6px 14px;
                margin-bottom: 16px;
            }

            h1 {
                margin-bottom: 16px;
            }

            .subtitle {
                margin-bottom: 32px;
            }

            .cta-primary {
                padding: 14px 32px;
                font-size: 16px;
            }

            .hero-cta {
                margin-bottom: 32px;
            }
        }

        @media (min-width: 769px) {
            .nav-mobile {
                display: none !important;
            }
        }
      `}</style>

      {/* Header */}
      <header>
        <div className="header-content">
          <a href="#" className="logo">
            <img src="logo.png" alt="AIOS Logo" style={{ height: 40, width: "auto" }} />
          </a>
          
          {/* Navigation Desktop */}
          <nav className="nav-desktop">
            <Link href="/formulaire" className="header-cta">
              Réserver maintenant
            </Link>
          </nav>

          {/* Burger Menu Button */}
          <button className="burger-menu" id="burgerMenu" aria-label="Menu">
            <span className="burger-line" />
            <span className="burger-line" />
            <span className="burger-line" />
          </button>
        </div>

        {/* Navigation Mobile */}
        <nav className="nav-mobile" id="navMobile">
          <div className="nav-mobile-cta">
            <Link href="/formulaire" className="header-cta">
              Réserver maintenant
            </Link>
          </div>
        </nav>
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
            Cabinets de Conseil :
          </div>

          <h1>
            Votre Équipe Perd <span className="gradient-text">4h/Jour</span><br />
            à Chercher des Infos ?
          </h1>

          <p className="subtitle">
            Je te donne GRATUITEMENT la solution exacte pour centraliser 
            les informations de ton cabinet. Sans migration lourde, 
            applicable <span style={{ textDecoration: 'underline' }}>dès maintenant</span>.
          </p>

          <div className="hero-cta">
            <Link href="/formulaire" className="cta-primary">
              Réserver maintenant
            </Link>
          </div>

          <div className="vsl-container">
            <div 
              dangerouslySetInnerHTML={{
                __html: '<vturb-smartplayer id="vid-6931bb2e77485fe7cdacd26b" style="display: block; margin: 0 auto; width: 100%;"></vturb-smartplayer>'
              }}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-logo">
            <img src="logo.png" alt="AIOS Logo" />
          </div>

          <hr className="footer-separator" />

          <div className="footer-bottom">
            <p style={{ fontWeight: 600, marginBottom: 16 }}>Copyright © 2025 by AIOS</p>
            <p style={{ marginBottom: 16 }}>
              Ce site ne fait pas partie du site Web de Facebook™ ou de Facebook™ Inc. FACEBOOK™ est une marque de commerce de FACEBOOK™, Inc.
            </p>
            <p>
              Contact : <a href="mailto:contact@ai-os.fr" style={{ textDecoration: "underline" }}>contact@ai-os.fr</a>
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}