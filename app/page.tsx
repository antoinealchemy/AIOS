'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import * as fbq from '@/lib/fbPixel'

export default function HomePage() {
  useEffect(() => {
    // 👁️ PIXEL FACEBOOK - VIEWCONTENT
    // Attendre 500ms que le script Facebook soit chargé
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

    // Stats Counter
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statCounter = entry.target as HTMLElement
          const statNumber = statCounter.closest('.stat-number') as HTMLElement
          const target = parseInt(statCounter.getAttribute('data-target') || '0')
          const duration = 1000
          const increment = target / (duration / 16)
          let current = 0

          if (statNumber) {
            statNumber.classList.add('visible')
          }

          const updateCounter = () => {
            current += increment
            if (current < target) {
              statCounter.textContent = Math.ceil(current).toString()
              requestAnimationFrame(updateCounter)
            } else {
              statCounter.textContent = target.toString()
            }
          }

          updateCounter()
          statsObserver.unobserve(statCounter)
        }
      })
    }, { threshold: 0.5 })

    document.querySelectorAll('.stat-counter').forEach(stat => {
      statsObserver.observe(stat)
    })

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(button => {
      button.addEventListener('click', () => {
        const faqItem = button.closest('.faq-item')
        if (faqItem) {
          faqItem.classList.toggle('active')
        }
      })
    })

    // Modals - Close on outside click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active')
        }
      })
    })

    // Modals - Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
          modal.classList.remove('active')
        })
      }
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

        .nav-links {
            display: flex;
            align-items: center;
            gap: 32px;
            list-style: none;
        }

        .nav-links a {
            color: #6C6C6C;
            text-decoration: none;
            font-size: 15px;
            font-weight: 400;
            transition: color 0.3s ease;
        }

        .nav-links a:hover {
            color: #1a1a1a;
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

        .nav-mobile-links {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .nav-mobile-links a {
            color: #6C6C6C;
            text-decoration: none;
            font-size: 18px;
            font-weight: 400;
            display: block;
            padding: 12px 0;
            border-bottom: 1px solid #F3F4F6;
            transition: color 0.3s ease;
        }

        .nav-mobile-links a:hover {
            color: #1a1a1a;
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

        /* Positions des icônes - au niveau du titre */
        /* Animations apesanteur + diagonale + rotation + scale */
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

        /* Icône 1 */
        @keyframes floatIcon1 {
            0%   { transform: translate3d(-6px, 0, 0) rotate(-4deg) scale(1); }
            25%  { transform: translate3d(4px, -18px, 0) rotate(-1deg) scale(1.06); }
            50%  { transform: translate3d(10px, -28px, 0) rotate(2deg) scale(1.08); }
            75%  { transform: translate3d(2px, -12px, 0) rotate(0deg) scale(1.04); }
            100% { transform: translate3d(-6px, 0, 0) rotate(-4deg) scale(1); }
        }

        /* Icône 2 */
        @keyframes floatIcon2 {
            0%   { transform: translate3d(6px, 0, 0) rotate(4deg) scale(1); }
            25%  { transform: translate3d(-4px, -20px, 0) rotate(0deg) scale(1.05); }
            50%  { transform: translate3d(-10px, -30px, 0) rotate(-3deg) scale(1.08); }
            75%  { transform: translate3d(-2px, -14px, 0) rotate(1deg) scale(1.04); }
            100% { transform: translate3d(6px, 0, 0) rotate(4deg) scale(1); }
        }

        /* Icône 3 */
        @keyframes floatIcon3 {
            0%   { transform: translate3d(-4px, 0, 0) rotate(-3deg) scale(1); }
            25%  { transform: translate3d(3px, 18px, 0) rotate(-1deg) scale(1.05); }
            50%  { transform: translate3d(8px, 28px, 0) rotate(2deg) scale(1.08); }
            75%  { transform: translate3d(0px, 12px, 0) rotate(0deg) scale(1.03); }
            100% { transform: translate3d(-4px, 0, 0) rotate(-3deg) scale(1); }
        }

        /* Icône 4 */
        @keyframes floatIcon4 {
            0%   { transform: translate3d(6px, 0, 0) rotate(3deg) scale(1); }
            25%  { transform: translate3d(-3px, 20px, 0) rotate(0deg) scale(1.05); }
            50%  { transform: translate3d(-10px, 30px, 0) rotate(-2deg) scale(1.08); }
            75%  { transform: translate3d(-1px, 14px, 0) rotate(1deg) scale(1.04); }
            100% { transform: translate3d(6px, 0, 0) rotate(3deg) scale(1); }
        }

        /* Animations flottement (haut-bas) */
        /* Animations flottement (haut-bas) - effet apesanteur accentué */
        /* Ajustement précis pour desktop */
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

        /* Responsive - afficher les 4 icônes sur mobile */
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
            margin-top: 24px;
            margin-bottom: 24px;
            letter-spacing: -0.02em;
        }

        .badge svg {
            width: 16px;
            height: 16px;
        }

        h1 {
            font-size: clamp(28px, 5vw, 60px);
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 16px;
            letter-spacing: -0.03em;
        }

        /* Afficher desktop par défaut, cacher mobile */
        .title-mobile,
        .subtitle-mobile {
            display: none;
        }

        .title-desktop,
        .subtitle-desktop {
            display: block;
        }

        /* Sur mobile : cacher desktop, afficher mobile */
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
        }

        .cta-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 20px 60px rgba(59, 130, 246, 0.5);
        }

        .cta-icon {
            width: 24px;
            height: 24px;
        }

        .cta-subtitle {
            margin-top: 12px;
            font-size: 14px;
            color: #6C6C6C;
        }

        .hero-cta {
            margin-bottom: 48px;
        }

        /* Social Proof Section */
        .social-proof {
            padding: 80px 24px;
            background: #F8F8F8;
        }

        .section-title {
            font-size: clamp(28px, 4vw, 40px);
            font-weight: 700;
            text-align: center;
            margin-bottom: 48px;
            color: #1a1a1a;
            letter-spacing: -0.03em;
        }

        /* Stats Section */
        .stats-section {
            padding: 0 24px 40px;
            background: #F8F8F8;
            margin-top: -10px;
        }

        .stats-title {
            text-align: center;
            font-size: 28px;
            font-weight: 500;
            color: #1a1a1a;
            margin-bottom: 20px;
            letter-spacing: -0.04em;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 48px;
            max-width: 1100px;
            margin: 0 auto;
        }

        .stat-item {
            text-align: center;
        }

        /* Barres verticales sur desktop */
        @media (min-width: 1024px) {
            .stat-item {
                position: relative;
                padding: 0 40px;
            }

            .stat-item:not(:first-child)::before {
                content: "";
                position: absolute;
                left: 0;
                top: 20%;
                height: 60%;
                width: 1px;
                background: #E5E7EB;
            }
        }

        .stat-number {
            font-size: 56px;
            font-weight: 800;
            background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 12px;
            letter-spacing: -0.03em;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .stat-suffix-small {
            font-size: 0.75em;
        }

        .stat-number.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .stat-prefix,
        .stat-suffix {
            display: inline;
        }

        .stat-label {
            font-size: 16px;
            color: #6C6C6C;
            font-weight: 400;
            line-height: 1.5;
        }

        @media (max-width: 768px) {
            .hero {
                padding: 48px 16px 12px;
                min-height: auto;
                align-items: flex-start;
            }

            /* Hero CTA moins d'espace sur mobile */
            .hero-cta {
                margin-bottom: 16px;
            }

            /* VSL plus proche des chiffres */
            .vsl-container {
                margin: 0 auto 8px;
            }

            /* Stats section ultra-serrée sur mobile */
            .stats-section {
                margin-top: -24px;
                padding-top: 0;
                padding-bottom: 8px !important;
                margin-bottom: 0 !important;
            }

            /* Section AIOS rapprochée sur mobile */
            .aios-features {
                padding-top: 32px !important;
                padding-bottom: 60px;
                margin-top: 0 !important;
            }

            /* Badge compact sur mobile */
            .features-badge {
                padding: 4px 14px !important;
                font-size: 12px !important;
                margin-bottom: 8px !important;
                margin-top: 0 !important;
            }

            /* Titre proche du badge sur mobile */
            .features-title {
                font-size: 28px;
                margin-top: 0 !important;
                margin-bottom: 32px !important;
            }

            .stat-item {
                margin-bottom: 24px;
                padding-bottom: 24px;
                position: relative;
            }

            .stat-item:not(:last-child)::after {
                content: "";
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 80%;
                height: 1px;
                background: #E5E7EB;
            }

            .stat-number {
                font-size: 42px;
                margin-bottom: 4px;
            }

            .stats-title {
                font-size: 20px;
                margin-bottom: 16px;
            }

            .stats-grid {
                gap: 24px;
            }

            .stat-label {
                margin-top: 0;
                font-size: 14px;
            }

            .features-grid {
                grid-template-columns: 1fr;
                gap: 24px;
            }

            .feature-card {
                padding: 32px 24px;
            }

            .feature-image {
                width: 150px;
                height: 150px;
            }
        }

        /* Before/After Section */
        .before-after {
            padding: 80px 24px;
            background: #F8F8F8;
        }

        /* AIOS Features Section */
        .aios-features {
            padding: 40px 24px 80px;
            background: #F8F8F8;
        }

        .features-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 5px 18px;
            background: rgba(59, 130, 246, 0.06);
            color: #3B82F6;
            border: 1px solid rgba(59, 130, 246, 0.4);
            border-radius: 999px;
            font-size: 13px;
            font-weight: 500;
            margin: 0 auto 10px;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .features-badge:hover {
            background: #3B82F6;
            color: white;
            transform: translateY(-2px);
        }

        .features-title {
            font-size: clamp(32px, 4vw, 48px);
            font-weight: 700;
            text-align: center;
            margin-bottom: 48px;
            color: #1a1a1a;
            letter-spacing: -0.03em;
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 32px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .feature-card {
            background: #FFFFFF;
            border-radius: 24px;
            padding: 32px 32px 40px;
            border: 1px solid #E5E7EB;
            transition: all 0.3s ease;
            overflow: hidden;
        }

        .feature-card:hover {
            transform: translateY(-4px);
            box-shadow: none;
            border-color: #3B82F6;
        }

        /* Wrapper neutre : plus de fond, plus d'ombre, juste un conteneur pour gérer la marge */
        .feature-image-wrapper {
            background: transparent;
            border-radius: 0;
            padding: 0;
            margin: 0 0 24px;
            box-shadow: none;
        }

        /* L'image occupe presque toute la largeur du cadre interne */
        .feature-image {
            width: 100%;
            height: auto;
            display: block;
            border-radius: 22px;
            object-fit: contain;
        }

        .feature-card h3 {
            font-size: 20px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 16px;
            line-height: 1.3;
            letter-spacing: -0.02em;
        }

        .feature-card p {
            font-size: 15px;
            color: #6C6C6C;
            line-height: 1.6;
            margin: 0;
        }

        @media (max-width: 768px) {
            .aios-features {
                padding: 40px 24px 60px;
            }

            .features-title {
                font-size: 28px;
                margin-bottom: 40px;
            }

            .features-grid {
                grid-template-columns: 1fr;
                gap: 24px;
            }

            .feature-card {
                padding: 28px 20px 32px;
            }

            .feature-image-wrapper {
                background: transparent;
                border-radius: 0;
                padding: 0;
                margin: 0 0 20px;
                box-shadow: none;
            }
        }

        .comparison-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
            max-width: 1000px;
            margin: 0 auto;
        }

        .comparison-box {
            border-radius: 16px;
            padding: 40px;
            background: white;
        }

        .before-box {
            border: 2px solid #FCA5A5;
        }

        .after-box {
            border: 2px solid #93C5FD;
        }

        .comparison-title {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .before-box .comparison-title {
            color: #F87171;
        }

        .after-box .comparison-title {
            color: #60A5FA;
        }

        .comparison-list {
            list-style: none;
        }

        .comparison-list li {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            margin-bottom: 16px;
            color: #374151;
        }

        .comparison-icon {
            width: 20px;
            height: 20px;
            margin-top: 2px;
            flex-shrink: 0;
        }

        .before-box .comparison-icon {
            color: #F87171;
        }

        .after-box .comparison-icon {
            color: #60A5FA;
        }


        /* Qualification Section */
        .qualification {
            padding: 80px 24px;
            background: #F8F8F8;
        }

        .qualification .container {
            text-align: center;
        }

        .section-subtitle {
            font-size: 18px;
            color: #6C6C6C;
            max-width: 700px;
            margin: 0 auto 48px;
            font-weight: 400;
        }

        .qualification-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 32px;
            max-width: 1100px;
            margin: 0 auto;
        }

        .qualification-box {
            border-radius: 24px;
            padding: 48px 40px;
            background: #FFFFFF;
            text-align: left;
            transition: all 0.3s ease;
        }

        .qualification-box:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
        }

        .for-you {
            border: 2px solid #3B82F6;
        }

        .not-for-you {
            border: 2px solid #D1D5DB;
        }

        .qualification-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 32px;
        }

        .qualification-icon-circle {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
            flex-shrink: 0;
        }

        .not-for-you-icon {
            background: #9CA3AF !important;
        }

        .qualification-header h3 {
            font-size: 28px;
            font-weight: 700;
            color: #1a1a1a;
            letter-spacing: -0.02em;
        }

        .qualification-list {
            list-style: none;
        }

        .qualification-list li {
            display: flex;
            align-items: flex-start;
            gap: 16px;
            margin-bottom: 20px;
            font-size: 16px;
            line-height: 1.6;
        }

        .qualification-list li:last-child {
            margin-bottom: 0;
        }

        .check-icon {
            width: 24px;
            height: 24px;
            color: #3B82F6;
            flex-shrink: 0;
            margin-top: 2px;
        }

        .cross-icon {
            width: 24px;
            height: 24px;
            color: #9CA3AF;
            flex-shrink: 0;
            margin-top: 2px;
        }

        .for-you .qualification-list li {
            color: #1a1a1a;
        }

        .not-for-you .qualification-list li {
            color: #6C6C6C;
        }

        /* Testimonials Carousel */
        .testimonials-carousel {
            padding: 40px 24px 20px;
            background: #F8F8F8;
            overflow: hidden;
        }

        .testimonials-carousel .container {
            text-align: center;
        }

        .carousel-wrapper {
            position: relative;
            max-width: 1200px;
            margin: 48px auto 0;
            overflow: hidden;
            mask-image: linear-gradient(
                to right,
                transparent,
                black 10%,
                black 90%,
                transparent
            );
            -webkit-mask-image: linear-gradient(
                to right,
                transparent,
                black 10%,
                black 90%,
                transparent
            );
        }

        .carousel-track {
            display: flex;
            gap: 24px;
            animation: scroll 40s linear infinite;
            width: fit-content;
        }

        @keyframes scroll {
            0% {
                transform: translateX(0);
            }
            100% {
                transform: translateX(calc(-50%));
            }
        }

        .testimonial-card {
            flex: 0 0 380px;
            background: #F8F8F8;
            border: 1px solid #E5E7EB;
            border-radius: 16px;
            padding: 32px;
            text-align: left;
            transition: all 0.3s ease;
        }

        .testimonial-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        .testimonial-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 20px;
        }

        .testimonial-avatar {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 24px;
            color: white;
            flex-shrink: 0;
            overflow: hidden;
        }

        .testimonial-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .testimonial-info h4 {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 8px;
        }

        .testimonial-stars {
            display: flex;
            gap: 4px;
        }

        .star {
            width: 16px;
            height: 16px;
        }

        .testimonial-text {
            font-size: 15px;
            line-height: 1.6;
            color: #1a1a1a;
            font-weight: 400;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .testimonials-carousel {
                padding: 60px 16px;
            }

            .carousel-wrapper {
                margin: 32px auto 0;
            }

            .testimonial-card {
                flex: 0 0 320px;
                padding: 24px;
            }

            .testimonial-avatar {
                width: 48px;
                height: 48px;
                font-size: 20px;
            }

            .testimonial-info h4 {
                font-size: 16px;
            }

            .testimonial-text {
                font-size: 14px;
            }
        }

        /* FAQ Section */
        .faq {
            padding: 40px 24px 10px;
            background: #F8F8F8;
        }

        .faq .container {
            text-align: center;
        }

        .faq-container {
            max-width: 800px;
            margin: 32px auto 0;
            text-align: left;
        }

        .faq-item {
            background: #FFFFFF;
            backdrop-filter: blur(10px);
            border: 1px solid #E5E7EB;
            border-radius: 12px;
            margin-bottom: 16px;
            overflow: hidden;
            transition: all 0.3s ease;
        }

        .faq-item:hover {
            border-color: rgba(59, 130, 246, 0.5);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
        }

        .faq-question {
            width: 100%;
            padding: 24px;
            background: none;
            border: none;
            color: #1a1a1a;
            font-size: 18px;
            font-weight: 600;
            text-align: left;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: inherit;
        }

        .faq-question:hover {
            color: #3B82F6;
        }

        .faq-icon {
            width: 20px;
            height: 20px;
            transition: transform 0.3s ease;
            color: #9CA3AF;
        }

        .faq-item.active .faq-icon {
            transform: rotate(180deg);
        }

        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            padding: 0 24px;
            color: #6C6C6C;
        }

        .faq-item.active .faq-answer {
            max-height: 500px;
            padding: 0 24px 24px;
        }

        /* CTA Secondary */
        .cta-secondary {
            padding: 40px 24px 80px;
            background: #F8F8F8;
            position: relative;
            overflow: hidden;
        }

        .cta-box {
            position: relative;
            max-width: 900px;
            margin: 0 auto;
            background: #FFFFFF;
            border: 1px solid #E5E7EB;
            border-radius: 24px;
            padding: 60px 40px;
            text-align: center;
            overflow: hidden;
        }

        .cta-secondary h2 {
            font-size: clamp(32px, 5vw, 56px);
            font-weight: 700;
            margin-bottom: 32px;
            color: #1a1a1a;
            letter-spacing: -0.02em;
            position: relative;
            z-index: 2;
        }

        .cta-arrow-container {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin-bottom: 20px;
            position: relative;
            z-index: 2;
        }

        .cta-arrow {
            width: 18px;
            height: 18px;
            color: #3B82F6;
        }

        .cta-secondary p {
            font-size: 18px;
            color: #6C6C6C;
            margin-bottom: 0;
            position: relative;
            z-index: 2;
            font-weight: 400;
        }

        .cta-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 14px 40px;
            background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            letter-spacing: -0.02em;
            position: relative;
            z-index: 2;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }

        .cta-button-large {
            padding: 24px 60px !important;
            font-size: 22px !important;
            font-weight: 700 !important;
            border-radius: 16px !important;
            box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4) !important;
        }

        .cta-button-large:hover {
            transform: translateY(-3px) !important;
            box-shadow: 0 12px 32px rgba(59, 130, 246, 0.5) !important;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .faq {
                padding: 32px 16px 10px !important;
            }

            .testimonials-carousel {
                padding: 30px 16px 10px !important;
            }

            .for-who {
                padding: 30px 16px 10px !important;
            }

            .cta-secondary {
                padding: 28px 16px 60px;
            }

            .cta-box {
                padding: 50px 24px;
            }

            .cta-secondary h2 {
                font-size: 32px;
            }

            .cta-secondary p {
                font-size: 16px;
            }

            .cta-button {
                font-size: 14px;
                padding: 12px 32px;
            }

            .cta-button-large {
                padding: 20px 48px !important;
                font-size: 18px !important;
            }
        }

        @media (max-width: 480px) {
            .cta-box {
                padding: 40px 20px;
            }

            .cta-secondary h2 {
                font-size: 28px;
                margin-bottom: 24px;
            }

            .cta-arrow-container {
                margin-bottom: 24px;
            }
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
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 48px;
            margin-bottom: 48px;
        }

        .footer-column h3 {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #1a1a1a;
            letter-spacing: -0.02em;
        }

        .footer-column ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .footer-column ul li {
            margin-bottom: 12px;
        }

        .footer-column a {
            color: #6C6C6C;
            text-decoration: none;
            font-size: 15px;
            transition: color 0.3s ease;
            letter-spacing: -0.01em;
        }

        .footer-column a:hover {
            color: #3B82F6;
        }

        .footer-logo {
            margin-bottom: 8px;
        }

        .footer-logo img {
            height: 48px;
            width: auto;
        }

        .footer-separator {
            border: none;
            border-top: 1px solid #E5E7EB;
            margin: 48px 0 32px;
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
                padding: 4px;
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

            .badge svg {
                width: 14px;
                height: 14px;
            }

            h1 {
                margin-bottom: 12px;
            }

            .subtitle {
                margin-bottom: 20px;
                font-size: 18px;
            }

            .section-title {
                font-size: 28px;
            }

            .cta-primary {
                padding: 12px 24px;
                font-size: 15px;
                gap: 8px;
            }

            .cta-icon {
                width: 18px;
                height: 18px;
            }

            .cta-subtitle {
                font-size: 12px;
            }

            .comparison-grid,
            .qualification-grid {
                grid-template-columns: 1fr;
            }

            /* Mobile menu */
            .nav-desktop {
                display: none;
            }

            .burger-menu {
                display: flex;
            }

            .nav-mobile {
                display: block;
            }
        }

        @media (min-width: 769px) {
            .nav-mobile {
                display: none !important;
            }
        }
        /* Accessibilité - Réduction des animations */
        @media (prefers-reduced-motion: reduce) {
            .floating-icon {
                animation: none;
                transform: none;
            }
        }

        /* Compactage extrême des chiffres sur mobile */
        @media (max-width: 768px) {
            /* Restaurer le titre visible */
            .stats-section {
                margin-top: 0 !important;
                padding-top: 8px !important;
                margin-bottom: 28px !important;
                padding-bottom: 20px !important;
            }

            /* Titre plus proche des chiffres */
            .stats-title {
                margin-bottom: 4px !important;
            }

            /* Remonter uniquement les chiffres, pas le titre */
            .stats-grid {
                gap: 8px !important;
                margin-top: -8px !important;
            }

            .stat-item {
                margin: 0 !important;
                padding: 12px 0 !important;
            }

            .stat-item:not(:last-child)::after {
                width: 70% !important;
                margin-top: 4px;
            }

            .stat-number {
                font-size: 38px !important;
                margin-bottom: 0 !important;
            }

            .stat-label {
                margin-top: 4px !important;
            }
        }
        /* Réduction de l'espace entre "AIOS C'est Quoi ?" et "AIOS n'est pas pour tout le monde" */
        .aios-features {
            padding-bottom: 32px;   /* avant : 80px (60px sur mobile) */
        }

        .for-who {
            padding-top: 16px;      /* avant : 40px */
        }

        @media (max-width: 768px) {
            .aios-features {
                padding-bottom: 24px;  /* avant : 60px */
            }

            .for-who {
                padding-top: 12px !important;  /* avant : 30px */
            }
        }

        /* MODALS */
        .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9999;
            justify-content: center;
            align-items: center;
            padding: 20px;
            overflow-y: auto;
        }

        .modal-overlay.active {
            display: flex;
        }

        .modal-content {
            background: white;
            border-radius: 16px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            font-size: 32px;
            cursor: pointer;
            color: #666;
            line-height: 1;
            padding: 0;
            width: 32px;
            height: 32px;
        }

        .modal-close:hover {
            color: #000;
        }

        .modal-content h2 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 24px;
            color: #1a1a1a;
        }

        .modal-content h3 {
            font-size: 20px;
            font-weight: 600;
            margin-top: 32px;
            margin-bottom: 16px;
            color: #2d2d2d;
        }

        .modal-content p {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 16px;
            color: #4a4a4a;
        }

        .modal-content ul {
            margin-left: 24px;
            margin-bottom: 16px;
        }

        .modal-content li {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 8px;
            color: #4a4a4a;
        }

        .modal-content a {
            color: #3B82F6;
            text-decoration: underline;
        }

        @media (max-width: 768px) {
            .modal-content {
                padding: 24px;
                max-height: 85vh;
            }

            .modal-content h2 {
                font-size: 24px;
            }

            .modal-content h3 {
                font-size: 18px;
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
                <ul className="nav-links">
                    <li><a href="#solution">La Solution</a></li>
                    <li><a href="#temoignages">Témoignages</a></li>
                    <li><a href="#faq">FAQ</a></li>
                </ul>
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
            <ul className="nav-mobile-links">
                <li><a href="#solution">La Solution</a></li>
                <li><a href="#temoignages">Témoignages</a></li>
                <li><a href="#faq">FAQ</a></li>
            </ul>
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
                Cabinets d'avocats :
            </div>

            <h1 className="title-desktop">
                Voici Comment Récupérer<br />
                <span className="gradient-text">Jusqu'à 40 Heures par Semaine</span><br />
                de Temps Non Facturable Sans Recruter de Junior
            </h1>

            <h1 className="title-mobile">
                Voici Comment Récupérer<br />
                <span className="gradient-text">Jusqu'à 40 Heures<br />par Semaine</span><br />
                de Temps Non Facturable<br />
                Sans Recruter de Junior
            </h1>

            <p className="subtitle subtitle-desktop">
                Transformez 30 minutes de recherche CCN en 8 secondes de réponse<br />
                grâce à un assistant IA qui connaît vos documents par cœur.
            </p>

            <p className="subtitle subtitle-mobile">
                Transformez 30 minutes de<br />
                recherche CCN en 8 secondes de<br />
                réponse grâce à un assistant IA<br />
                qui connaît vos documents par cœur.
            </p>

            <div className="hero-cta">
                <Link href="/formulaire" className="cta-primary">
                    Réserver maintenant
                </Link>
            </div>

            <div className="vsl-container">
                <div 
                    dangerouslySetInnerHTML={{
                        __html: `
                            <vturb-smartplayer id="vid-69389fe12d3bc2eda4ce04c2" style="display: block; margin: 0 auto; width: 100%;"></vturb-smartplayer>
                            <script type="text/javascript">
                                var s=document.createElement("script");
                                s.src="https://scripts.converteai.net/c0135ce6-524c-4d83-9601-c2d9acd8de6f/players/69389fe12d3bc2eda4ce04c2/v4/player.js";
                                s.async=true;
                                document.head.appendChild(s);
                            </script>
                        `
                    }}
                />
            </div>
        </div>
    </section>

    {/* Stats Section */}
    <section className="stats-section">
        <div className="container">
            <h2 className="stats-title">AIOS en quelques chiffres</h2>
            <div className="stats-grid">
                <div className="stat-item">
                    <div className="stat-number">
                        <span className="stat-counter" data-target="1725">0</span><span className="stat-suffix">h/an</span>
                    </div>
                    <div className="stat-label">gagnées pour nos clients</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number">
                        <span className="stat-counter" data-target="98">0</span><span className="stat-suffix">%</span>
                    </div>
                    <div className="stat-label">de taux de réponse précise</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number">
                        <span className="stat-counter" data-target="108">0</span><span className="stat-suffix">K€</span>
                    </div>
                    <div className="stat-label">Gagnés supplémentaires par an</div>
                </div>
            </div>
        </div>
    </section>

    {/* AIOS Features Section */}
    <section className="aios-features" id="solution">
        <div className="container" style={{ textAlign: "center" }}>
            <a href="#solution" className="features-badge">
                En savoir plus
            </a>
            
            <h2 className="features-title">AI<span className="gradient-text">OS</span> C'est Quoi ?</h2>

            <div className="features-grid">
                {/* Feature 1 */}
                <div className="feature-card">
                    <div className="feature-image-wrapper">
                        <img src="image1.png" alt="Cerveau IA" className="feature-image" />
                    </div>
                    <h3>Votre Mémoire d'Entreprise Centralisée</h3>
                    <p>On installe et personnalisons pour vous un assistant IA qui connaît votre entreprise en profondeur. Accessible par toute l'équipe. Question → Réponse instantanée.</p>
                </div>

                {/* Feature 2 */}
                <div className="feature-card">
                    <div className="feature-image-wrapper">
                        <img src="image2.png" alt="ROI" className="feature-image" />
                    </div>
                    <h3>ROI immédiatement mesurable</h3>
                    <p>Temps gagné = Argent gagné. Moins de recherche, plus de production. Chaque heure récupérée augmente votre capacité facturable. ROI visible dès J1.</p>
                </div>

                {/* Feature 3 */}
                <div className="feature-card">
                    <div className="feature-image-wrapper">
                        <img src="image3.png" alt="Recherche instantanée" className="feature-image" />
                    </div>
                    <h3>Zéro temps perdu à chercher</h3>
                    <p>Informations sur un client ? Historique d'un projet ? Décision passée ? Ne perdez plus jamais 20 min à chercher l'information.</p>
                </div>

                {/* Feature 4 */}
                <div className="feature-card">
                    <div className="feature-image-wrapper">
                        <img src="image4.png" alt="Analyse 24/7" className="feature-image" />
                    </div>
                    <h3>Vision 360° Sur Votre Entreprise</h3>
                    <p>Interrogez votre base de données complète pour obtenir une vue d'ensemble instantanée.</p>
                </div>
            </div>
        </div>
    </section>


    {/* Testimonials Carousel */}
    <section className="testimonials-carousel" id="temoignages">
        <div className="container">
            <div className="badge">Résultats</div>
            <h2 className="section-title">
                Nos Testeurs en Parlent Mieux Que Nous
            </h2>

            <div className="carousel-wrapper">
                <div className="carousel-track">
                    {/* Testimonial 1 */}
                    <div className="testimonial-card">
                        <div className="testimonial-header">
                            <div className="testimonial-avatar"><img src="profile/thomas.jpg" alt="Thomas" /></div>
                            <div className="testimonial-info">
                                <h4>Thomas</h4>
                                <div className="testimonial-stars">
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <p className="testimonial-text">"Avant AIOS, on perdait de précieuses heures par jour à chercher des infos dispersées entre Gmail, Drive et Notion. Maintenant, on pose une question et on a la réponse en quelques secondes. Mon équipe a gagné 15h par semaine. C'est simple : sans AIOS, on ne pourrait plus travailler."</p>
                    </div>

                    {/* Testimonial 2 */}
                    <div className="testimonial-card">
                        <div className="testimonial-header">
                            <div className="testimonial-avatar"><img src="profile/sophie.jpg" alt="Sophie" /></div>
                            <div className="testimonial-info">
                                <h4>Sophie</h4>
                                <div className="testimonial-stars">
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <p className="testimonial-text">"Dès la première semaine, j'ai préparé 4 appels clients en 10 minutes au lieu de 2h. Le ROI est immédiat. Pour nous, c'est un game changer absolu. On ne reviendrait en arrière pour rien au monde."</p>
                    </div>

                    {/* Testimonial 3 */}
                    <div className="testimonial-card">
                        <div className="testimonial-header">
                            <div className="testimonial-avatar"><img src="profile/marc.jpg" alt="Marc" /></div>
                            <div className="testimonial-info">
                                <h4>Marc</h4>
                                <div className="testimonial-stars">
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <p className="testimonial-text">"Avant : chaos total. Après : clarté absolue. AIOS connaît tous nos clients mieux que nous. Mon équipe est bien plus productive. Meilleur investissement business de l'année."</p>
                    </div>

                    {/* Testimonial 4 */}
                    <div className="testimonial-card">
                        <div className="testimonial-header">
                            <div className="testimonial-avatar"><img src="profile/claire.jpg" alt="Claire" /></div>
                            <div className="testimonial-info">
                                <h4>Claire</h4>
                                <div className="testimonial-stars">
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <p className="testimonial-text">"Je ne pensais pas qu'on pouvait gagner autant de temps. 15h par semaine récupérées pour notre équipe, c'est l'équivalent d'un recrutement évité. En plus, l'équipe d'AIOS nous a livré en 6 jours. Rapide, efficace, transformateur."</p>
                    </div>

                    {/* Testimonial 5 */}
                    <div className="testimonial-card">
                        <div className="testimonial-header">
                            <div className="testimonial-avatar"><img src="profile/david.jpg" alt="David" /></div>
                            <div className="testimonial-info">
                                <h4>David</h4>
                                <div className="testimonial-stars">
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <p className="testimonial-text">"Le vrai avant/après : avant, on naviguait à l'aveugle. Après AIOS, on a une vision complète de tous nos clients en temps réel. Mes consultants sont autonomes, je prends de meilleures décisions. Honnêtement, je ne comprends pas comment on faisait avant."</p>
                    </div>

                    {/* Testimonial 6 */}
                    <div className="testimonial-card">
                        <div className="testimonial-header">
                            <div className="testimonial-avatar"><img src="profile/julie.jpg" alt="Julie" /></div>
                            <div className="testimonial-info">
                                <h4>Julie</h4>
                                <div className="testimonial-stars">
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <p className="testimonial-text">"Mise en place rapide et résultats immédiats. En 2 semaines, toute l'équipe l'utilise quotidiennement. On a éliminé les réunions de sync inutiles. Productivité en hausse, stress en baisse. Si vous hésitez encore : foncez."</p>
                    </div>

                    {/* Duplicate for seamless loop */}
                    <div className="testimonial-card">
                        <div className="testimonial-header">
                            <div className="testimonial-avatar"><img src="profile/thomas.jpg" alt="Thomas" /></div>
                            <div className="testimonial-info">
                                <h4>Thomas</h4>
                                <div className="testimonial-stars">
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <p className="testimonial-text">"Avant AIOS, on perdait de précieuses heures par jour à chercher des infos dispersées entre Gmail, Drive et Notion. Maintenant, on pose une question et on a la réponse en quelques secondes. Mon équipe a gagné 15h par semaine. C'est simple : sans AIOS, on ne pourrait plus travailler."</p>
                    </div>

                    <div className="testimonial-card">
                        <div className="testimonial-header">
                            <div className="testimonial-avatar"><img src="profile/sophie.jpg" alt="Sophie" /></div>
                            <div className="testimonial-info">
                                <h4>Sophie</h4>
                                <div className="testimonial-stars">
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <p className="testimonial-text">"Dès la première semaine, j'ai préparé 4 appels clients en 10 minutes au lieu de 2h. Le ROI est immédiat. Pour nous, c'est un game changer absolu. On ne reviendrait en arrière pour rien au monde."</p>
                    </div>

                    <div className="testimonial-card">
                        <div className="testimonial-header">
                            <div className="testimonial-avatar"><img src="profile/marc.jpg" alt="Marc" /></div>
                            <div className="testimonial-info">
                                <h4>Marc</h4>
                                <div className="testimonial-stars">
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                    <svg className="star" viewBox="0 0 24 24" fill="#FDB022">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <p className="testimonial-text">"Avant : chaos total. Après : clarté absolue. AIOS connaît tous nos clients mieux que nous. Mon équipe est bien plus productive. Meilleur investissement business de l'année."</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* FAQ */}
    <section className="faq" id="faq">
        <div className="container">
            <div className="badge">FAQ</div>
            <h2 className="section-title">
                Les Questions Fréquentes
            </h2>

            <div className="faq-container">
                <div className="faq-item">
                    <button className="faq-question">
                        <span>AIOS, c'est quoi concrètement ?</span>
                        <svg className="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                    <div className="faq-answer">
                        AIOS, c'est votre nouvel assistant intelligent qui centralise toutes les informations de votre entreprise. Le résultat ? Vous posez une question, vous obtenez la réponse précise instantanément. Plus besoin de chercher dans 5 outils différents : tout est à portée de main, instantanément.
                    </div>
                </div>

                <div className="faq-item">
                    <button className="faq-question">
                        <span>C'est uniquement pour le CEO ou toute l'équipe peut l'utiliser ?</span>
                        <svg className="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                    <div className="faq-answer">
                        Les deux sont possibles. AIOS peut être configuré exclusivement pour le dirigeant, ou bien pour toute l'équipe (consultants, CMO, CFO, etc.). Chaque membre accède aux informations dont il a besoin selon son rôle. Vous choisissez qui utilise l'outil et comment, on s'adapte à votre organisation.
                    </div>
                </div>

                <div className="faq-item">
                    <button className="faq-question">
                        <span>Qui va avoir accès à mes données ?</span>
                        <svg className="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                    <div className="faq-answer">
                        Personne d'autre que vous et votre équipe. Vos données ne sont jamais exploitées, revendues ou consultées par des tiers. Nous signons un NDA avant même de commencer. Hébergement sécurisé EU (Claude AI), conformité RGPD totale. Vos données restent votre propriété, toujours.
                    </div>
                </div>

                <div className="faq-item">
                    <button className="faq-question">
                        <span>Combien de temps prend la mise en place ?</span>
                        <svg className="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                    <div className="faq-answer">
                        2 semaines du début à la fin. Nous vous transmettons les formulaires à remplir et on s'occupe d'absolument toute la configuration interne de votre assistant. Au bout de 2 semaines, votre livrable complet est prêt à l'emploi.
                    </div>
                </div>

                <div className="faq-item">
                    <button className="faq-question">
                        <span>Concrètement, qu'est-ce qu'on reçoit ?</span>
                        <svg className="faq-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                    <div className="faq-answer">
                        Votre Assistant IA personnalisé (Claude Project configuré sur-mesure pour votre entreprise) et une courte formation vidéo pour vous aider à exploiter votre assistant à 100% de son potentiel. Tout est clé en main.
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* CTA Secondary */}
    <section className="cta-secondary">
        <div className="cta-box">
            <Link href="/formulaire" className="cta-button cta-button-large">
                Réserver maintenant
            </Link>
        </div>
    </section>

    {/* MODALS */}
    
    {/* Modal Contact */}
    <div className="modal-overlay" id="modal-contact">
        <div className="modal-content">
            <button className="modal-close" onClick={() => document.getElementById('modal-contact')?.classList.remove('active')}>×</button>
            <h2>Contact</h2>
            <p>Pour toute question concernant AIOS ou notre offre gratuite, contactez-nous :</p>
            <p><strong>Email :</strong> <a href="mailto:antoine.alchemy@gmail.com">antoine.alchemy@gmail.com</a></p>
            <p>Réponse sous 24-48h ouvrées</p>
        </div>
    </div>

    {/* Modal Mentions Légales */}
    <div className="modal-overlay" id="modal-mentions">
        <div className="modal-content">
            <button className="modal-close" onClick={() => document.getElementById('modal-mentions')?.classList.remove('active')}>×</button>
            <h2>Mentions Légales</h2>
            <p><strong>Dernière mise à jour :</strong> 9 décembre 2025</p>
            
            <h3>1. Éditeur du site</h3>
            <p><strong>Nom :</strong> Antoine Perreaut<br />
            <strong>Statut :</strong> Micro-entreprise<br />
            <strong>Siège social :</strong> Paris, France<br />
            <strong>Email :</strong> <a href="mailto:antoine.alchemy@gmail.com">antoine.alchemy@gmail.com</a></p>

            <h3>2. Hébergement</h3>
            <p><strong>Hébergeur :</strong> Vercel Inc.<br />
            <strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, USA<br />
            <strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">vercel.com</a></p>

            <h3>3. Propriété intellectuelle</h3>
            <p>Tous les contenus présents sur ce site (textes, images, logos, vidéos) sont protégés par les droits de propriété intellectuelle et appartiennent à AIOS / Antoine Perreaut, sauf mention contraire.</p>
            <p>Toute reproduction, distribution, modification ou utilisation non autorisée est interdite.</p>

            <h3>4. Données personnelles</h3>
            <p>Voir notre <button onClick={() => { document.getElementById('modal-mentions')?.classList.remove('active'); document.getElementById('modal-confidentialite')?.classList.add('active'); }} style={{ background: 'none', border: 'none', color: '#3B82F6', textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit' }}>Politique de Confidentialité</button></p>

            <h3>5. Contact</h3>
            <p>Pour toute question concernant ces mentions légales :<br />
            <a href="mailto:antoine.alchemy@gmail.com">antoine.alchemy@gmail.com</a></p>
        </div>
    </div>

    {/* Modal Confidentialité */}
    <div className="modal-overlay" id="modal-confidentialite">
        <div className="modal-content">
            <button className="modal-close" onClick={() => document.getElementById('modal-confidentialite')?.classList.remove('active')}>×</button>
            <h2>Politique de Confidentialité</h2>
            <p><strong>Dernière mise à jour :</strong> 9 décembre 2025</p>

            <h3>1. Qui sommes-nous ?</h3>
            <p>AIOS est un service développé par Antoine Perreaut, spécialisé dans l'implémentation d'assistants IA pour entreprises.</p>

            <h3>2. Données collectées</h3>
            <p>Lors de votre demande de call gratuit, nous collectons :</p>
            <ul>
                <li>Nom et prénom</li>
                <li>Email professionnel</li>
                <li>Nom de l'entreprise</li>
                <li>Téléphone</li>
                <li>Informations sur votre organisation (CA, secteur d'activité)</li>
            </ul>

            <h3>3. Utilisation de vos données</h3>
            <p>Vos données sont utilisées uniquement pour :</p>
            <ul>
                <li>Vous contacter pour le call découverte</li>
                <li>Implémenter AIOS pour votre cabinet</li>
                <li>Assurer le support technique</li>
            </ul>
            <p>Nous ne vendons, ne louons, ni ne partageons vos données avec des tiers.</p>

            <h3>4. Protection de vos données d'entreprise</h3>
            <p><strong>Important :</strong> Les données sensibles de votre entreprise (emails, documents, dossiers clients) partagées pour le setup AIOS sont protégées comme suit :</p>
            <ul>
                <li>NDA signé avant tout accès à vos données</li>
                <li>Hébergement sécurisé : Vos données sont hébergées sur Claude (Anthropic), conforme RGPD et SOC 2 Type II</li>
                <li>Accès limité : Seule notre équipe technique y accède, uniquement pour configuration</li>
                <li>Aucune utilisation commerciale : Vos données ne servent qu'à créer votre assistant IA personnalisé</li>
                <li>Suppression sur demande : Vous pouvez demander suppression totale à tout moment</li>
            </ul>

            <h3>5. Durée de conservation</h3>
            <ul>
                <li>Données de contact : Conservées 3 ans après dernier contact</li>
                <li>Données entreprise (setup AIOS) : Conservées 3 ans maximum, suppression immédiate sur simple demande</li>
            </ul>

            <h3>6. Vos droits (RGPD)</h3>
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
                <li>Accès : Consulter vos données</li>
                <li>Rectification : Corriger vos données</li>
                <li>Suppression : Effacer vos données à tout moment</li>
                <li>Opposition : Refuser traitement</li>
                <li>Portabilité : Récupérer vos données</li>
            </ul>
            <p>Pour exercer ces droits : <a href="mailto:antoine.alchemy@gmail.com">antoine.alchemy@gmail.com</a></p>

            <h3>7. Cookies</h3>
            <p>Notre site utilise uniquement des cookies techniques nécessaires au fonctionnement (pas de tracking publicitaire).</p>

            <h3>8. Contact</h3>
            <p>Pour toute question sur vos données : <a href="mailto:antoine.alchemy@gmail.com">antoine.alchemy@gmail.com</a></p>
        </div>
    </div>

    {/* Modal CGU */}
    <div className="modal-overlay" id="modal-cgu">
        <div className="modal-content">
            <button className="modal-close" onClick={() => document.getElementById('modal-cgu')?.classList.remove('active')}>×</button>
            <h2>Conditions Générales d'Utilisation (CGU)</h2>
            <p><strong>Dernière mise à jour :</strong> 9 décembre 2025</p>

            <h3>1. Objet</h3>
            <p>Les présentes CGU régissent l'utilisation du service AIOS proposé par Antoine Perreaut.</p>

            <h3>2. Description du service</h3>
            <p>AIOS propose un setup gratuit d'assistant IA basé sur Claude Projects pour cabinets professionnels (conseil, expertise comptable, avocats).</p>
            <p><strong>Offre limitée :</strong> 5 cabinets seulement.</p>

            <h3>3. Conditions d'accès</h3>
            <p>Pour bénéficier du setup gratuit, le cabinet doit :</p>
            <ul>
                <li>CA annuel minimum : 200 000€</li>
                <li>Être motivé à implémenter rapidement</li>
                <li>Accepter de partager informations organisation (sous NDA)</li>
                <li>Fournir feedback écrit ET vidéo après utilisation</li>
            </ul>
            <p><strong>Important :</strong> Nous sélectionnons les cabinets avec qui nous travaillons. Une demande ne garantit pas l'acceptation.</p>

            <h3>4. Engagements du cabinet</h3>
            <p>En acceptant l'offre gratuite, le cabinet s'engage à :</p>
            <ul>
                <li>Fournir accès aux données nécessaires (emails, documents) pour configuration</li>
                <li>Participer aux calls de setup et formation</li>
                <li>Tester la solution activement pendant 30 jours minimum</li>
                <li>Fournir feedback écrit ET vidéo honnête</li>
                <li>Autoriser utilisation de son témoignage pour publicités, site internet et communication marketing</li>
                <li>Autoriser affichage du logo de votre cabinet sur notre site internet</li>
            </ul>
            <p><strong>Clause importante :</strong> Si le feedback attendu (écrit + vidéo) n'est pas fourni dans les délais convenus, nous nous réservons le droit de retirer l'accès au système AIOS.</p>

            <h3>5. Engagements AIOS</h3>
            <p>Nous nous engageons à :</p>
            <ul>
                <li>Livrer setup fonctionnel sous 14 jours après réception données</li>
                <li>Former votre équipe à l'utilisation</li>
                <li>Assurer support technique 1 mois après livraison</li>
                <li>Respecter confidentialité absolue (NDA signé)</li>
                <li>Ne jamais utiliser vos données à des fins commerciales</li>
            </ul>

            <h3>6. Durée d'accès</h3>
            <p><strong>Période d'essai beta :</strong> L'accès gratuit est fourni pendant la période de test convenue (généralement 30-60 jours).</p>
            <p>Après cette période et réception des feedbacks :</p>
            <ul>
                <li>Le système reste fonctionnel sur votre compte Claude</li>
                <li>Support technique limité (selon disponibilité)</li>
            </ul>

            <h3>7. Propriété intellectuelle</h3>
            <ul>
                <li>AIOS : Système, méthode, prompts restent propriété d'Antoine Perreaut</li>
                <li>Vos données : Restent votre propriété exclusive</li>
                <li>Output Claude Projects : Appartient au cabinet</li>
            </ul>

            <h3>8. Limitation de responsabilité</h3>
            <p>Le service est fourni "tel quel" dans le cadre d'une offre beta gratuite.</p>
            <p>AIOS ne peut être tenu responsable de :</p>
            <ul>
                <li>Interruptions temporaires du service Claude (Anthropic)</li>
                <li>Erreurs ou imprécisions dans les réponses générées par l'IA</li>
                <li>Décisions prises sur base des réponses fournies</li>
            </ul>
            <p><strong>Recommandation :</strong> Toujours vérifier informations critiques.</p>

            <h3>9. Résiliation</h3>
            <p>Chaque partie peut mettre fin à la collaboration à tout moment par email.</p>
            <p>En cas d'arrêt :</p>
            <ul>
                <li>Vos données sont supprimées sous 30 jours (ou immédiatement sur demande)</li>
                <li>Accès AIOS peut être révoqué si feedback non fourni</li>
            </ul>

            <h3>10. Données personnelles</h3>
            <p>Voir notre <button onClick={() => { document.getElementById('modal-cgu')?.classList.remove('active'); document.getElementById('modal-confidentialite')?.classList.add('active'); }} style={{ background: 'none', border: 'none', color: '#3B82F6', textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit' }}>Politique de Confidentialité</button> pour détails sur traitement des données.</p>

            <h3>11. Modification des CGU</h3>
            <p>Nous nous réservons le droit de modifier ces CGU. Modifications communiquées par email.</p>

            <h3>12. Droit applicable</h3>
            <p>CGU soumises au droit français.</p>

            <h3>13. Contact</h3>
            <p>Pour toute question : <a href="mailto:antoine.alchemy@gmail.com">antoine.alchemy@gmail.com</a></p>
        </div>
    </div>

    {/* Footer */}
    <footer>
        <div className="footer-content">
            {/* Logo */}
            <div className="footer-column">
                <div className="footer-logo">
                    <img src="logo.png" alt="AIOS Logo" />
                </div>
            </div>

            {/* Pages */}
            <div className="footer-column">
                <h3>Pages</h3>
                <ul>
                    <li><a href="#solution">La Solution</a></li>
                    <li><a href="#temoignages">Témoignages</a></li>
                    <li><a href="#faq">FAQ</a></li>
                </ul>
            </div>

            {/* Légal */}
            <div className="footer-column">
                <h3>Légal</h3>
                <ul>
                    <li><button onClick={() => document.getElementById('modal-contact')?.classList.add('active')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, font: 'inherit' }}>Contact</button></li>
                    <li><button onClick={() => document.getElementById('modal-mentions')?.classList.add('active')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, font: 'inherit' }}>Mentions Légales</button></li>
                    <li><button onClick={() => document.getElementById('modal-confidentialite')?.classList.add('active')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, font: 'inherit' }}>Confidentialité</button></li>
                    <li><button onClick={() => document.getElementById('modal-cgu')?.classList.add('active')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, font: 'inherit' }}>CGU</button></li>
                </ul>
            </div>
        </div>

        {/* Separator */}
        <hr className="footer-separator" />

        {/* Bottom */}
        <div className="footer-bottom">
            <p style={{ fontWeight: 600, marginBottom: 16 }}>Copyright © 2025 by AIOS</p>
            <p>
                Ce site ne fait pas partie du site Web de Facebook™ ou de Facebook™ Inc. FACEBOOK™ est une marque de commerce de FACEBOOK™, Inc.
            </p>
        </div>
    </footer>

    </>
  )
}