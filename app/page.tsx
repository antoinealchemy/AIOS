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

        .vsl-placeholder {
            position: relative;
            aspect-ratio: 16/9;
            background: linear-gradient(135deg, #2C3E50 0%, #1a252f 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        .vsl-placeholder:hover {
            transform: scale(1.02);
        }

        .play-button {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
        }

        .vsl-placeholder:hover .play-button {
            transform: scale(1.1);
            box-shadow: 0 15px 40px rgba(59, 130, 246, 0.6);
        }

        .play-icon {
            width: 0;
            height: 0;
            border-left: 24px solid white;
            border-top: 14px solid transparent;
            border-bottom: 14px solid transparent;
            margin-left: 6px;
        }

        .vsl-text {
            position: absolute;
            bottom: 20px;
            text-align: center;
            width: 100%;
            color: #9CA3AF;
            font-size: 14px;
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
        <div className="hero-content">
          <div className="badge">
            Cabinets de Conseil
          </div>

          <h1>
            Votre Équipe Perd <span className="gradient-text">4h/Jour</span><br />
            à Chercher des Infos ?
          </h1>

          <p className="subtitle">
            Appel 30 minutes offert : Je te donne une méthode 100% gratuite 
            pour centraliser les informations de ton cabinet. 
            Sans migration lourde, applicable dès maintenant. 
            Résultats immédiats garantis.
          </p>

          <div className="hero-cta">
            <Link href="/formulaire" className="cta-primary">
              Réserver l'appel gratuit
            </Link>
            <p className="cta-subtitle">
              💡 Méthode complète offerte. Zéro migration technique.
            </p>
          </div>

          <div className="vsl-container">
            <div className="vsl-placeholder">
              <div className="play-button">
                <div className="play-icon"></div>
              </div>
              <p className="vsl-text">Clique pour voir la présentation (90 sec)</p>
            </div>
          </div>

          <div style={{ marginTop: '32px' }}>
            <Link href="/formulaire" className="cta-primary">
              Réserver l'appel gratuit
            </Link>
            <p className="cta-subtitle">
              30 minutes d'échange. Tu repars avec une solution complète.
            </p>
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
