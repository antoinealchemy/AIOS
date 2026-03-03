'use client'

import Link from 'next/link'

export default function MentionsLegalesPage() {
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
        <h1>MENTIONS LEGALES</h1>

        <h2>Editeur du site</h2>
        <p>
          Le site ai-os.fr est edite par :<br />
          Antoine Perreaut<br />
          Statut : Entrepreneur individuel<br />
          SIRET : En cours d'immatriculation<br />
          Email : contact@ai-os.fr
        </p>

        <h2>Hebergeur</h2>
        <p>
          Vercel Inc.<br />
          340 Pine Street, Suite 701<br />
          San Francisco, CA 94104, Etats-Unis<br />
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">https://vercel.com</a>
        </p>

        <h2>Propriete intellectuelle</h2>
        <p>
          L'ensemble des contenus presents sur ce site (textes, images, videos) sont la propriete exclusive d'Antoine Perreaut. Toute reproduction est interdite sans autorisation prealable.
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
