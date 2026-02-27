'use client'

import Link from 'next/link'

export default function ConfidentialitePage() {
  return (
    <>
      <style jsx global>{`
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
          letter-spacing: -0.02em;
        }

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

        main {
          max-width: 800px;
          margin: 0 auto;
          padding: 60px 24px;
        }

        h1 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 40px;
          letter-spacing: -0.03em;
        }

        h2 {
          font-size: 20px;
          font-weight: 600;
          margin-top: 32px;
          margin-bottom: 12px;
          letter-spacing: -0.02em;
        }

        p {
          color: #4B5563;
          margin-bottom: 16px;
        }

        ul {
          color: #4B5563;
          margin-bottom: 16px;
          padding-left: 24px;
        }

        li {
          margin-bottom: 8px;
        }

        a {
          color: #3B82F6;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        footer {
          padding: 48px 24px 60px;
          background: #FFFFFF;
          border-top: 1px solid #E5E7EB;
          text-align: center;
        }

        .footer-links {
          margin-bottom: 16px;
        }

        .footer-links a {
          color: #6C6C6C;
          margin: 0 12px;
          font-size: 14px;
        }

        .footer-links a:hover {
          color: #3B82F6;
        }

        .copyright {
          color: #6C6C6C;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          header {
            padding: 12px 0;
          }

          .logo img {
            height: 28px;
          }

          main {
            padding: 40px 20px;
          }

          h1 {
            font-size: 24px;
          }
        }
      `}</style>

      <header>
        <div className="header-content">
          <Link href="/lm" className="logo">
            <img src="/logo.png" alt="AIOS Logo" />
          </Link>
        </div>
      </header>

      <main>
        <h1>POLITIQUE DE CONFIDENTIALITE</h1>

        <h2>Responsable du traitement</h2>
        <p>Antoine Perreaut — contact@ai-os.fr</p>

        <h2>Donnees collectees</h2>
        <p>Dans le cadre de l'utilisation du site ai-os.fr, nous collectons les donnees suivantes :</p>
        <ul>
          <li>Prenom</li>
          <li>Adresse email</li>
        </ul>

        <h2>Finalite</h2>
        <p>
          Ces donnees sont collectees dans le but de vous envoyer une etude de cas gratuite et, le cas echeant, de vous contacter dans le cadre d'une prise de rendez-vous commercial.
        </p>

        <h2>Duree de conservation</h2>
        <p>
          Vos donnees sont conservees pendant une duree maximale de 6 mois a compter de leur collecte, puis supprimees.
        </p>

        <h2>Vos droits (RGPD)</h2>
        <p>Conformement au Reglement General sur la Protection des Donnees (RGPD), vous disposez des droits suivants :</p>
        <ul>
          <li>Droit d'acces a vos donnees</li>
          <li>Droit de rectification</li>
          <li>Droit a l'effacement</li>
          <li>Droit d'opposition au traitement</li>
        </ul>
        <p>Pour exercer ces droits, contactez-nous a : contact@ai-os.fr</p>

        <h2>Cookies</h2>
        <p>
          Ce site utilise des cookies a des fins de mesure d'audience (Facebook Pixel). Vous pouvez desactiver les cookies dans les parametres de votre navigateur.
        </p>
      </main>

      <footer>
        <div className="footer-links">
          <Link href="/mentions-legales">Mentions legales</Link>
          <Link href="/confidentialite">Politique de confidentialite</Link>
        </div>
        <p className="copyright">Copyright © 2025 by AIOS</p>
      </footer>
    </>
  )
}
