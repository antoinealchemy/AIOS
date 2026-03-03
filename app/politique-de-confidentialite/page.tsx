'use client'

import Link from 'next/link'

export default function PolitiqueConfidentialitePage() {
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
          line-height: 1.7;
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
          padding: 60px 24px 80px;
        }

        h1 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 16px;
          letter-spacing: -0.03em;
          color: #1a1a1a;
        }

        .last-updated {
          color: #6B7280;
          font-size: 14px;
          margin-bottom: 40px;
          padding-bottom: 24px;
          border-bottom: 1px solid #E5E7EB;
        }

        .intro {
          font-size: 17px;
          color: #374151;
          margin-bottom: 40px;
          padding: 24px;
          background: #FFFFFF;
          border-radius: 12px;
          border: 1px solid #E5E7EB;
        }

        h2 {
          font-size: 22px;
          font-weight: 600;
          margin-top: 40px;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
          color: #1a1a1a;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        h2 .number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
          color: white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
        }

        h3 {
          font-size: 17px;
          font-weight: 600;
          margin-top: 24px;
          margin-bottom: 12px;
          color: #374151;
        }

        p {
          color: #4B5563;
          margin-bottom: 16px;
          font-size: 15px;
        }

        ul {
          color: #4B5563;
          margin-bottom: 16px;
          padding-left: 24px;
          font-size: 15px;
        }

        li {
          margin-bottom: 10px;
        }

        a {
          color: #3B82F6;
          text-decoration: none;
          font-weight: 500;
        }

        a:hover {
          text-decoration: underline;
        }

        .contact-box {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 24px;
          margin: 24px 0;
        }

        .contact-box p {
          margin-bottom: 8px;
          color: #1a1a1a;
        }

        .contact-box a {
          font-size: 16px;
        }

        .highlight-box {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 20px 24px;
          margin: 20px 0;
        }

        .table-wrapper {
          overflow-x: auto;
          margin: 20px 0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: #FFFFFF;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #E5E7EB;
          font-size: 14px;
        }

        th {
          background: #F9FAFB;
          padding: 14px 16px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 1px solid #E5E7EB;
        }

        td {
          padding: 14px 16px;
          color: #4B5563;
          border-bottom: 1px solid #F3F4F6;
        }

        tr:last-child td {
          border-bottom: none;
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
          font-weight: 400;
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
            padding: 32px 20px 60px;
          }

          h1 {
            font-size: 26px;
          }

          h2 {
            font-size: 18px;
          }

          h2 .number {
            width: 28px;
            height: 28px;
            font-size: 12px;
          }

          .intro {
            padding: 20px;
            font-size: 15px;
          }

          table {
            font-size: 13px;
          }

          th, td {
            padding: 10px 12px;
          }
        }
      `}</style>

      <header>
        <div className="header-content">
          <Link href="/" className="logo">
            <img src="/logo.png" alt="AIOS Logo" />
          </Link>
        </div>
      </header>

      <main>
        <h1>Politique de Confidentialite</h1>
        <p className="last-updated">Derniere mise a jour : 3 mars 2026</p>

        <div className="intro">
          <p style={{ marginBottom: 0 }}>
            Chez AIOS, nous accordons une importance capitale a la protection de vos donnees personnelles.
            Cette politique de confidentialite vous informe sur la maniere dont nous collectons, utilisons
            et protegeons vos informations conformement au Reglement General sur la Protection des Donnees (RGPD).
          </p>
        </div>

        <h2><span className="number">1</span> Responsable du traitement</h2>
        <div className="highlight-box">
          <p><strong>AIOS</strong></p>
          <p>Site web : <a href="https://ai-os.fr" target="_blank" rel="noopener noreferrer">ai-os.fr</a></p>
          <p style={{ marginBottom: 0 }}>Contact : <a href="mailto:contact@ai-os.fr">contact@ai-os.fr</a></p>
        </div>
        <p>
          AIOS est une entreprise francaise specialisee dans la conception et le deploiement de solutions
          d'assistant IA sur mesure pour les entreprises de services (cabinets comptables, cabinets de conseil,
          cabinets d'avocats, etc.).
        </p>

        <h2><span className="number">2</span> Donnees collectees</h2>
        <p>Dans le cadre de l'utilisation de notre site et de nos services, nous collectons les categories de donnees suivantes :</p>

        <h3>Donnees d'identification</h3>
        <ul>
          <li>Nom et prenom</li>
          <li>Adresse email professionnelle</li>
          <li>Numero de telephone</li>
        </ul>

        <h3>Donnees professionnelles</h3>
        <ul>
          <li>Nom de l'entreprise</li>
          <li>Secteur d'activite</li>
          <li>Taille de l'entreprise (nombre d'employes)</li>
          <li>Chiffre d'affaires</li>
          <li>Nombre de dossiers clients traites</li>
        </ul>

        <h3>Donnees de navigation</h3>
        <ul>
          <li>Cookies techniques et de mesure d'audience</li>
          <li>Donnees du pixel Facebook (pages visitees, conversions)</li>
          <li>Adresse IP (anonymisee)</li>
        </ul>

        <h2><span className="number">3</span> Finalites du traitement</h2>
        <p>Vos donnees sont collectees et traitees pour les finalites suivantes :</p>
        <ul>
          <li><strong>Repondre a vos demandes</strong> : traitement de vos demandes d'audit gratuit ou de demonstration</li>
          <li><strong>Prospection commerciale</strong> : vous recontacter par email ou telephone pour vous presenter nos solutions</li>
          <li><strong>Prise de rendez-vous</strong> : gestion des rendez-vous via notre outil Calendly</li>
          <li><strong>Amelioration de nos campagnes</strong> : optimisation de nos publicites Facebook Ads grace aux donnees de conversion</li>
          <li><strong>Amelioration de nos services</strong> : analyse statistique pour ameliorer l'experience utilisateur</li>
        </ul>

        <h2><span className="number">4</span> Base legale du traitement</h2>
        <p>Le traitement de vos donnees repose sur les bases legales suivantes :</p>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Finalite</th>
                <th>Base legale</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Reponse aux demandes de contact</td>
                <td>Consentement (soumission du formulaire)</td>
              </tr>
              <tr>
                <td>Prospection commerciale B2B</td>
                <td>Interet legitime</td>
              </tr>
              <tr>
                <td>Mesure d'audience et publicite</td>
                <td>Consentement (cookies)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2><span className="number">5</span> Duree de conservation</h2>
        <p>Nous conservons vos donnees pendant les durees suivantes :</p>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Type de donnees</th>
                <th>Duree de conservation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Donnees prospects</td>
                <td>12 mois apres le dernier contact</td>
              </tr>
              <tr>
                <td>Donnees clients</td>
                <td>Duree du contrat + 3 ans</td>
              </tr>
              <tr>
                <td>Cookies et traceurs</td>
                <td>13 mois maximum</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>Au-dela de ces delais, vos donnees sont supprimees ou anonymisees.</p>

        <h2><span className="number">6</span> Destinataires des donnees</h2>
        <p>
          <strong>Vos donnees ne sont jamais vendues ni louees a des tiers.</strong>
        </p>
        <p>Elles peuvent etre transmises uniquement aux categories de destinataires suivantes :</p>
        <ul>
          <li><strong>Notre equipe interne</strong> : pour le traitement de vos demandes et le suivi commercial</li>
          <li><strong>Sous-traitants techniques</strong> : hebergement web, envoi d'emails, outil de prise de rendez-vous (Calendly)</li>
          <li><strong>Facebook/Meta</strong> : donnees de conversion via le pixel Facebook (dans le cadre de nos campagnes publicitaires)</li>
        </ul>
        <p>
          Tous nos sous-traitants sont selectionnes pour leur conformite au RGPD et sont lies par des
          clauses contractuelles garantissant la protection de vos donnees.
        </p>

        <h2><span className="number">7</span> Vos droits (RGPD)</h2>
        <p>Conformement au Reglement General sur la Protection des Donnees, vous disposez des droits suivants :</p>
        <ul>
          <li><strong>Droit d'acces</strong> : obtenir une copie des donnees que nous detenons sur vous</li>
          <li><strong>Droit de rectification</strong> : corriger des donnees inexactes ou incompletes</li>
          <li><strong>Droit a l'effacement</strong> : demander la suppression de vos donnees</li>
          <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos donnees, notamment pour la prospection</li>
          <li><strong>Droit a la portabilite</strong> : recevoir vos donnees dans un format structure et lisible</li>
          <li><strong>Droit a la limitation</strong> : demander la suspension temporaire du traitement</li>
        </ul>

        <div className="contact-box">
          <p><strong>Pour exercer vos droits, contactez-nous :</strong></p>
          <p>Email : <a href="mailto:contact@ai-os.fr">contact@ai-os.fr</a></p>
          <p style={{ marginBottom: 0, color: '#6B7280', fontSize: '14px' }}>
            Nous nous engageons a repondre a votre demande dans un delai de 30 jours.
          </p>
        </div>

        <p>
          En cas de difficulte, vous pouvez egalement introduire une reclamation aupres de la CNIL
          (Commission Nationale de l'Informatique et des Libertes) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
        </p>

        <h2><span className="number">8</span> Cookies et traceurs</h2>
        <p>Notre site utilise des cookies pour les finalites suivantes :</p>

        <h3>Pixel Facebook</h3>
        <p>
          Nous utilisons le pixel Facebook pour mesurer l'efficacite de nos campagnes publicitaires
          et suivre les conversions (soumissions de formulaires, prises de rendez-vous). Ce traceur
          permet d'optimiser nos publicites et de vous proposer du contenu pertinent.
        </p>

        <h3>Gestion des cookies</h3>
        <p>
          Vous pouvez a tout moment desactiver les cookies en modifiant les parametres de votre navigateur.
          Voici comment proceder selon votre navigateur :
        </p>
        <ul>
          <li><strong>Chrome</strong> : Parametres &gt; Confidentialite et securite &gt; Cookies</li>
          <li><strong>Firefox</strong> : Options &gt; Vie privee et securite</li>
          <li><strong>Safari</strong> : Preferences &gt; Confidentialite</li>
          <li><strong>Edge</strong> : Parametres &gt; Cookies et autorisations de site</li>
        </ul>
        <p>
          Note : la desactivation des cookies peut affecter certaines fonctionnalites du site.
        </p>

        <h2><span className="number">9</span> Securite des donnees</h2>
        <p>
          Nous mettons en oeuvre des mesures techniques et organisationnelles appropriees pour proteger
          vos donnees personnelles contre tout acces non autorise, modification, divulgation ou destruction :
        </p>
        <ul>
          <li>Hebergement sur des serveurs securises et certifies</li>
          <li>Chiffrement des donnees en transit (HTTPS/TLS)</li>
          <li>Acces restreint aux donnees (principe du moindre privilege)</li>
          <li>Sauvegardes regulieres et securisees</li>
        </ul>

        <h2><span className="number">10</span> Modifications de la politique</h2>
        <p>
          Nous nous reservons le droit de modifier cette politique de confidentialite a tout moment.
          En cas de modification substantielle, nous vous en informerons par email ou via une notification
          sur notre site. La date de derniere mise a jour est indiquee en haut de cette page.
        </p>

        <div className="contact-box" style={{ marginTop: '48px' }}>
          <p><strong>Une question sur vos donnees ?</strong></p>
          <p style={{ marginBottom: 0 }}>
            N'hesitez pas a nous contacter a <a href="mailto:contact@ai-os.fr">contact@ai-os.fr</a>.
            Nous sommes a votre disposition pour repondre a toutes vos questions concernant la protection
            de vos donnees personnelles.
          </p>
        </div>
      </main>

      <footer>
        <div className="footer-links">
          <Link href="/legal/mentions-legales">Mentions legales</Link>
          <Link href="/politique-de-confidentialite">Politique de confidentialite</Link>
          <Link href="/">Retour au site</Link>
        </div>
        <p className="copyright">Copyright © 2025 by AIOS</p>
      </footer>
    </>
  )
}
