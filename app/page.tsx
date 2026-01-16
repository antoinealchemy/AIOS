'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import * as fbq from '@/lib/fbPixel'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function OptinPage() {
  const [showCTA, setShowCTA] = useState(true) // Toujours visible pour optin
  const [showPopup, setShowPopup] = useState(false)
  const [formData, setFormData] = useState({
    prenom: '',
    email: '',
    telephone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    // 👁️ PIXEL FACEBOOK - VIEWCONTENT
    // Attendre 500ms que le script Facebook soit chargé
    setTimeout(() => {
      fbq.event('ViewContent', {
        content_name: 'Page Optin Formation'
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

        /* Responsive - masquer les icônes sur mobile */
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

            <div className="vsl-container" onClick={handleOpenPopup} style={{ cursor: 'pointer' }}>
                <img src="/1.gif" alt="Formation IA pour avocats" style={{ width: '100%', display: 'block' }} />
            </div>

            {showCTA && (
                <div className="hero-cta" style={{ marginTop: '32px' }}>
                    <button onClick={handleOpenPopup} className="cta-primary" style={{ border: 'none', font: 'inherit', fontWeight: 800 }}>
                        Accéder à la formation gratuite
                    </button>
                </div>
            )}
        </div>
    </section>

    {/* Footer */}
    <footer>
        {/* Bottom */}
        <div className="footer-bottom">
            <p style={{ fontWeight: 600, marginBottom: 16 }}>Copyright © 2025 by AIOS</p>
            <p style={{ marginBottom: 24 }}>
                Ce site ne fait pas partie du site Web de Facebook™ ou de Facebook™ Inc. FACEBOOK™ est une marque de commerce de FACEBOOK™, Inc.
            </p>
            
            {/* Liens légaux */}
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '14px' }}>
                <button onClick={() => document.getElementById('modal-contact')?.classList.add('active')} style={{ background: 'none', border: 'none', color: '#6C6C6C', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline' }}>Contact</button>
                <button onClick={() => document.getElementById('modal-mentions')?.classList.add('active')} style={{ background: 'none', border: 'none', color: '#6C6C6C', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline' }}>Mentions Légales</button>
                <button onClick={() => document.getElementById('modal-confidentialite')?.classList.add('active')} style={{ background: 'none', border: 'none', color: '#6C6C6C', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline' }}>Confidentialité</button>
                <button onClick={() => document.getElementById('modal-cgu')?.classList.add('active')} style={{ background: 'none', border: 'none', color: '#6C6C6C', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline' }}>CGU</button>
            </div>
        </div>
    </footer>

    {/* Popup Modal Optin */}
    {showPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }} onClick={handleClosePopup}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px 48px',
            maxWidth: '500px',
            width: '100%',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button onClick={handleClosePopup} style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: '#666',
              width: '40px',
              height: '40px',
              borderRadius: '50%'
            }}>
              ×
            </button>

            {!submitSuccess ? (
              <>
                {/* Pourcentage au-dessus de la barre */}
                <div style={{
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#3B82F6',
                  marginBottom: '4px'
                }} className="progress-percent">50%</div>

                {/* Barre de progression animée */}
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: '#e5e7eb',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  marginBottom: '16px'
                }} className="progress-bar-container">
                  <div style={{
                    width: '50%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px)',
                      animation: 'slideStripes 1s linear infinite'
                    }}></div>
                  </div>
                </div>

                <h2 style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  marginBottom: '8px',
                  color: '#1a1a1a',
                  textAlign: 'center'
                }} className="popup-title">Dernière étape 🔓</h2>

                {/* Sub-headline sous le titre */}
                <p style={{
                  fontSize: '16px',
                  color: '#666',
                  marginBottom: '20px',
                  textAlign: 'center',
                  fontWeight: 500
                }} className="popup-subtitle">
                  Où devons-nous envoyer la formation ?
                </p>

                <style>{`
                  @keyframes slideStripes {
                    from { transform: translateX(0); }
                    to { transform: translateX(20px); }
                  }

                  /* Desktop: espacements normaux */
                  @media (min-width: 769px) {
                    .progress-percent {
                      margin-bottom: 6px !important;
                    }
                    .progress-bar-container {
                      margin-bottom: 20px !important;
                    }
                    .popup-title {
                      margin-bottom: 12px !important;
                    }
                    .popup-subtitle {
                      margin-bottom: 24px !important;
                    }
                    .form-field {
                      margin-bottom: 20px !important;
                    }
                  }

                  /* Mobile: espacements réduits (défaut) */
                  @media (max-width: 768px) {
                    .progress-percent {
                      margin-bottom: 4px !important;
                    }
                    .progress-bar-container {
                      margin-bottom: 16px !important;
                    }
                    .popup-title {
                      margin-bottom: 8px !important;
                    }
                    .popup-subtitle {
                      margin-bottom: 20px !important;
                    }
                    .form-field {
                      margin-bottom: 16px !important;
                    }
                  }
                `}</style>

                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '16px' }} className="form-field">
                    <label style={{
                      display: 'block',
                      fontWeight: 600,
                      marginBottom: '8px',
                      color: '#1a1a1a',
                      fontSize: '14px'
                    }}>Prénom *</label>
                    <input
                      type="text"
                      placeholder="Votre prénom"
                      required
                      value={formData.prenom}
                      onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '16px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }} className="form-field">
                    <label style={{
                      display: 'block',
                      fontWeight: 600,
                      marginBottom: '8px',
                      color: '#1a1a1a',
                      fontSize: '14px'
                    }}>Email * <span style={{ fontWeight: 400, fontSize: '14px', color: '#666' }}>(promis, pas de spam 😉)</span></label>
                    <input
                      type="email"
                      placeholder="votre@email.com"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '16px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }} className="form-field">
                    <label style={{
                      display: 'block',
                      fontWeight: 600,
                      marginBottom: '8px',
                      color: '#1a1a1a',
                      fontSize: '14px'
                    }}>Téléphone *</label>
                    <input
                      type="tel"
                      placeholder="06 12 34 56 78"
                      required
                      value={formData.telephone}
                      onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '10px',
                        fontSize: '16px',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <button type="submit" disabled={isSubmitting} style={{
                    width: '100%',
                    padding: '16px',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '18px',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.6 : 1,
                    marginTop: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {isSubmitting ? 'ENVOI EN COURS...' : 'REGARDER MAINTENANT'}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <svg fill="none" stroke="white" viewBox="0 0 24 24" style={{ width: '40px', height: '40px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#1a1a1a',
                  marginBottom: '12px'
                }}>Merci !</h3>
                <p style={{ fontSize: '16px', color: '#666' }}>
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