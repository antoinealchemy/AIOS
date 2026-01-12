'use client'

import { useEffect } from 'react'
import Image from 'next/image'

export default function NCPage() {
  useEffect(() => {
    // Pas de pixel Facebook pour non-qualifiés
  }, [])

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: linear-gradient(135deg, #EFF6FF 0%, #ECFEFF 100%);
          color: #1a1a1a;
        }

        .header {
          background: white;
          border-bottom: 1px solid #E5E7EB;
          padding: 16px 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .logo-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          text-align: center;
        }

        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 60px 24px;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 60px;
        }

        .emoji {
          font-size: 64px;
          margin-bottom: 24px;
        }

        .title {
          font-size: 36px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .subtitle {
          font-size: 18px;
          color: #6C6C6C;
          line-height: 1.6;
          margin-bottom: 32px;
        }

        .info-box {
          background: white;
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .info-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 16px;
          color: #1a1a1a;
        }

        .info-text {
          font-size: 16px;
          color: #6C6C6C;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .info-list {
          list-style: none;
          padding: 0;
        }

        .info-list li {
          padding: 12px 0;
          padding-left: 32px;
          position: relative;
          color: #6C6C6C;
          font-size: 16px;
          line-height: 1.5;
        }

        .info-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #3B82F6;
          font-weight: 700;
          font-size: 18px;
        }

        .videos-section {
          margin-top: 48px;
        }

        .section-title {
          font-size: 28px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 40px;
          color: #1a1a1a;
        }

        .videos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .video-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s;
        }

        .video-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
        }

        .video-thumbnail {
          width: 100%;
          aspect-ratio: 16 / 9;
          background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 48px;
          position: relative;
          cursor: pointer;
        }

        .video-content {
          padding: 20px;
        }

        .video-title {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .video-description {
          font-size: 14px;
          color: #6C6C6C;
          line-height: 1.5;
        }

        .video-duration {
          display: inline-block;
          background: rgba(59, 130, 246, 0.1);
          color: #3B82F6;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin-top: 12px;
        }

        .cta-box {
          background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          color: white;
          margin-top: 48px;
        }

        .cta-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .cta-text {
          font-size: 16px;
          margin-bottom: 24px;
          opacity: 0.9;
        }

        .cta-button {
          display: inline-block;
          background: white;
          color: #3B82F6;
          padding: 14px 32px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }

        .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .title {
            font-size: 28px;
          }

          .subtitle {
            font-size: 16px;
          }

          .videos-grid {
            grid-template-columns: 1fr;
          }

          .info-box {
            padding: 24px;
          }

          .cta-box {
            padding: 32px 24px;
          }
        }
      `}</style>

      <div className="header">
        <div className="logo-container">
          <Image 
            src="/logo.png" 
            alt="AIOS Logo" 
            width={120} 
            height={40}
            className="h-10 w-auto mx-auto"
          />
        </div>
      </div>

      <div className="container">
        {/* HERO SECTION */}
        <div className="hero-section">
          <div className="emoji">🎯</div>
          <h1 className="title">
            AIOS est conçu pour les décisionnaires de cabinets d'avocats
          </h1>
          <p className="subtitle">
            Notre solution nécessite une décision stratégique au niveau direction et un réel besoin opérationnel.
          </p>
        </div>

        {/* INFO BOXES */}
        <div className="info-box">
          <h2 className="info-title">Pourquoi cette sélection ?</h2>
          <p className="info-text">
            AIOS transforme radicalement l'organisation d'un cabinet en automatisant la recherche juridique et la gestion documentaire. Cette transformation requiert :
          </p>
          <ul className="info-list">
            <li>Un pouvoir décisionnel pour valider l'investissement et piloter le changement</li>
            <li>Un accès complet aux documents sensibles du cabinet (CCN, contrats, dossiers)</li>
            <li>Une réelle douleur opérationnelle justifiant l'investissement (15-30h/semaine perdues)</li>
            <li>Une motivation forte à transformer les processus actuels</li>
          </ul>
        </div>

        <div className="info-box">
          <h2 className="info-title">Si vous êtes collaborateur ou avocat junior</h2>
          <p className="info-text">
            Vous reconnaissez peut-être ce problème au quotidien. La bonne nouvelle ? Vous pouvez être l'acteur du changement :
          </p>
          <p className="info-text" style={{ fontWeight: 600, color: '#3B82F6' }}>
            → Partagez cette page avec votre associé ou dirigeant
          </p>
          <p className="info-text">
            Ils pourront évaluer si AIOS correspond aux besoins stratégiques du cabinet et prendre la décision d'implémentation.
          </p>
        </div>

        {/* VIDEOS SECTION */}
        <div className="videos-section">
          <h2 className="section-title">En attendant : découvrez AIOS en vidéo</h2>
          
          <div className="videos-grid">
            {/* VIDEO 1 */}
            <div className="video-card">
              <div className="video-thumbnail">
                ▶️
              </div>
              <div className="video-content">
                <h3 className="video-title">Démo : Recherche CCN en 8 secondes</h3>
                <p className="video-description">
                  Découvrez comment AIOS transforme 30 minutes de recherche dans une Convention Collective en une réponse instantanée avec sources exactes.
                </p>
                <span className="video-duration">3 min</span>
              </div>
            </div>

            {/* VIDEO 2 */}
            <div className="video-card">
              <div className="video-thumbnail">
                ▶️
              </div>
              <div className="video-content">
                <h3 className="video-title">Cas client : Cabinet 5 avocats</h3>
                <p className="video-description">
                  Témoignage d'un cabinet lyonnais qui a récupéré 20h/semaine et augmenté son CA de 15% en 3 mois avec AIOS.
                </p>
                <span className="video-duration">5 min</span>
              </div>
            </div>

            {/* VIDEO 3 */}
            <div className="video-card">
              <div className="video-thumbnail">
                ▶️
              </div>
              <div className="video-content">
                <h3 className="video-title">Comment ça marche ?</h3>
                <p className="video-description">
                  Explication technique : RAG, Claude Projects, sécurité RGPD, et intégration dans votre workflow existant.
                </p>
                <span className="video-duration">4 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA FINAL */}
        <div className="cta-box">
          <h2 className="cta-title">Vous êtes décisionnaire et ce problème vous parle ?</h2>
          <p className="cta-text">
            Si vous avez répondu trop rapidement ou si votre situation a changé, vous pouvez recommencer le questionnaire.
          </p>
          <a href="/formulaire" className="cta-button">
            Recommencer le formulaire
          </a>
        </div>
      </div>
    </>
  )
}