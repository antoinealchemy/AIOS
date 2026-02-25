'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import * as fbq from '@/lib/fbPixel'

export default function QualificationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [sessionId, setSessionId] = useState('')
  const [formData, setFormData] = useState({
    secteur: '',
    secteurAutre: '',
    chiffreAffaires: '',
    nombreEmployes: '',
    intensiteProbleme: 5,
    prenom: '',
    email: '',
    phonePrefix: '+33',
    phoneNumber: ''
  })

  useEffect(() => {
    // Générer session_id unique
    const id = `lm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    setSessionId(id)

    // Récupérer les données pré-remplies depuis /lm/capture
    try {
      const storedPrenom = sessionStorage.getItem('lm_prenom')
      const storedEmail = sessionStorage.getItem('lm_email')
      if (storedPrenom || storedEmail) {
        setFormData(prev => ({
          ...prev,
          prenom: storedPrenom || prev.prenom,
          email: storedEmail || prev.email
        }))
      }
    } catch (e) {}

    // Pixel Facebook
    try {
      fbq.customEvent('FormulairePage_LM', {
        content_name: 'LM Qualification'
      })
    } catch (e) {}
  }, [])

  // Sauvegarder dans Supabase (à chaque étape)
  const saveToSupabase = async (step: number, completed: boolean = false) => {
    if (!sessionId) return null

    const dataToSend = {
      session_id: sessionId,
      step: step,
      completed: completed,
      source: 'lm',
      secteur: formData.secteur || null,
      secteur_autre: formData.secteur === 'autre' ? formData.secteurAutre : null,
      chiffre_affaires: formData.chiffreAffaires || null,
      nombre_employes: formData.nombreEmployes || null,
      intensite_probleme: formData.intensiteProbleme,
      name: formData.prenom || null,
      email: formData.email || null,
      phone: formData.phoneNumber ? `${formData.phonePrefix}${formData.phoneNumber}` : null
    }

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      })
      return await response.json()
    } catch (error) {
      return null
    }
  }

  const handleNext = async () => {
    // QUESTION 1 - Secteur d'activité
    if (currentStep === 1) {
      if (!formData.secteur) {
        alert('Veuillez sélectionner votre secteur d\'activité')
        return
      }
      if (formData.secteur === 'autre' && !formData.secteurAutre.trim()) {
        alert('Veuillez préciser votre secteur d\'activité')
        return
      }
      await saveToSupabase(1)
      setCurrentStep(2)
      return
    }

    // QUESTION 2 - Chiffre d'affaires
    if (currentStep === 2) {
      if (!formData.chiffreAffaires) {
        alert('Veuillez sélectionner votre chiffre d\'affaires')
        return
      }
      await saveToSupabase(2)
      setCurrentStep(3)
      return
    }

    // QUESTION 3 - Nombre d'employés
    if (currentStep === 3) {
      if (!formData.nombreEmployes) {
        alert('Veuillez sélectionner le nombre d\'employés')
        return
      }
      await saveToSupabase(3)
      setCurrentStep(4)
      return
    }

    // QUESTION 4 - Intensité du problème
    if (currentStep === 4) {
      await saveToSupabase(4)
      setCurrentStep(5)
      return
    }

    // QUESTION 5 - Coordonnées (dernière)
    if (currentStep === 5) {
      // Validation email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        alert('Veuillez entrer un email valide')
        return
      }

      // Validation téléphone (9 ou 10 chiffres)
      const phoneDigits = formData.phoneNumber.replace(/\D/g, '')
      if (phoneDigits.length < 9 || phoneDigits.length > 10) {
        alert('Le numéro de téléphone doit contenir 9 ou 10 chiffres')
        return
      }

      await saveToSupabase(5, true)

      // Pixel Facebook - Lead_LM (distinct du tunnel principal)
      fbq.customEvent('Lead_LM', {
        content_name: 'Lead Qualifié LM',
        value: 4500,
        currency: 'EUR'
      })

      // Redirect vers Calendly directement avec données préremplies
      const params = new URLSearchParams({
        name: formData.prenom,
        email: formData.email,
        a1: `${formData.phonePrefix}${formData.phoneNumber}`,
        utm_content: sessionId
      })
      window.location.href = `https://calendly.com/antoinealchemy/audit-personnalise?${params.toString()}`
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    if (currentStep === 1) {
      if (formData.secteur === 'autre') return formData.secteurAutre.trim() !== ''
      return formData.secteur !== ''
    }
    if (currentStep === 2) return formData.chiffreAffaires !== ''
    if (currentStep === 3) return formData.nombreEmployes !== ''
    if (currentStep === 4) return true
    if (currentStep === 5) {
      const phoneDigits = formData.phoneNumber.replace(/\D/g, '')
      return formData.prenom.trim() !== '' &&
             formData.email.includes('@') &&
             phoneDigits.length >= 9 && phoneDigits.length <= 10
    }
    return false
  }

  // Calcul progression (5 étapes au total)
  const progressPercentage = (currentStep / 5) * 100

  const secteurOptions = [
    { value: 'cabinet-avocats', label: 'Cabinet d\'avocats' },
    { value: 'cabinet-comptable', label: 'Cabinet comptable' },
    { value: 'cabinet-conseil', label: 'Cabinet de conseil' },
    { value: 'medical-sante', label: 'Entreprise médicale / santé' },
    { value: 'agence-immobiliere', label: 'Agence immobilière' },
    { value: 'bureau-etudes', label: 'Bureau d\'études / ingénierie' },
    { value: 'services-b2b', label: 'Entreprise de services B2B' },
    { value: 'rh-recrutement', label: 'Ressources humaines / recrutement' },
    { value: 'autre', label: 'Autre' }
  ]

  const caOptions = [
    { value: 'moins-250k', label: 'Moins de 250 000€' },
    { value: '250k-500k', label: 'Entre 250 000€ et 500 000€' },
    { value: 'plus-500k', label: 'Plus de 500 000€' }
  ]

  const employesOptions = [
    { value: '1-5', label: '1 à 5' },
    { value: '5-20', label: '5 à 20' },
    { value: '20-50', label: '20 à 50' },
    { value: 'plus-50', label: 'Plus de 50' }
  ]

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

        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 24px;
        }

        .header {
          background: white;
          border-bottom: 1px solid #E5E7EB;
          padding: 16px 0;
          margin-bottom: 40px;
        }

        .logo-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          text-align: center;
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: #E5E7EB;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-text {
          font-size: 14px;
          font-weight: 600;
          color: #3B82F6;
          min-width: 45px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%);
          transition: width 0.3s ease;
        }

        .form-card {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .question-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 32px;
          color: #1a1a1a;
        }

        .options-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
        }

        .option-button {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          background: #F9FAFB;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 16px;
          color: #1a1a1a;
          text-align: left;
          width: 100%;
        }

        .option-button:hover {
          background: #F3F4F6;
          border-color: #3B82F6;
          transform: translateY(-2px);
        }

        .option-button.selected {
          background: #EFF6FF;
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .radio-circle {
          width: 24px;
          height: 24px;
          border: 2px solid #D1D5DB;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
        }

        .option-button.selected .radio-circle {
          border-color: #3B82F6;
          background: #3B82F6;
        }

        .radio-circle-inner {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: white;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .option-button.selected .radio-circle-inner {
          opacity: 1;
        }

        .input-field {
          width: 100%;
          padding: 16px 20px;
          font-size: 16px;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          background: #F9FAFB;
          transition: all 0.2s;
          margin-bottom: 32px;
        }

        .input-field:focus {
          outline: none;
          border-color: #3B82F6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .input-field-small {
          margin-top: 16px;
          margin-bottom: 0;
        }

        .fields-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 32px;
        }

        .field-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .field-label {
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .field-group .input-field {
          margin-bottom: 0;
        }

        .phone-input {
          display: flex;
          gap: 8px;
        }

        .phone-prefix {
          width: 90px;
          padding: 16px 12px;
          font-size: 16px;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          background: #F9FAFB;
          cursor: pointer;
          outline: none;
        }

        .phone-prefix:focus {
          border-color: #3B82F6;
          background: white;
        }

        .phone-number {
          flex: 1;
          padding: 16px 20px;
          font-size: 16px;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          background: #F9FAFB;
          transition: all 0.2s;
        }

        .phone-number:focus {
          outline: none;
          border-color: #3B82F6;
          background: white;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .buttons-container {
          display: flex;
          gap: 12px;
          justify-content: space-between;
        }

        .btn-back {
          padding: 16px 32px;
          font-size: 16px;
          font-weight: 600;
          border: 2px solid #E5E7EB;
          background: white;
          color: #6B7280;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-back:hover {
          border-color: #D1D5DB;
          background: #F9FAFB;
        }

        .btn-next {
          padding: 16px 32px;
          font-size: 16px;
          font-weight: 600;
          background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          flex: 1;
        }

        .btn-next:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
        }

        .btn-next:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Slider styles */
        .slider-container {
          margin-bottom: 32px;
        }

        .slider-labels {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
          font-size: 14px;
          color: #6B7280;
        }

        .slider-value {
          text-align: center;
          font-size: 48px;
          font-weight: 700;
          color: #3B82F6;
          margin-bottom: 24px;
        }

        .slider {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: #E5E7EB;
          outline: none;
          -webkit-appearance: none;
          appearance: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          transition: transform 0.2s;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }

        .slider::-moz-range-thumb {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .slider-scale {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 12px;
          color: #9CA3AF;
        }

        @media (max-width: 640px) {
          .container {
            padding: 16px;
          }

          .form-card {
            padding: 24px;
          }

          .question-title {
            font-size: 20px;
          }

          .option-button {
            padding: 16px;
            font-size: 14px;
          }

          .slider-value {
            font-size: 36px;
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
            priority
          />
        </div>
      </div>

      <div className="container">
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
          </div>
          <span className="progress-text">{progressPercentage}%</span>
        </div>

        <div className="form-card">
          {/* QUESTION 1 - SECTEUR D'ACTIVITÉ */}
          {currentStep === 1 && (
            <>
              <h2 className="question-title">Quel est votre secteur d'activité ?</h2>

              <div className="options-container">
                {secteurOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`option-button ${formData.secteur === option.value ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, secteur: option.value, secteurAutre: option.value !== 'autre' ? '' : formData.secteurAutre })}
                  >
                    <div className="radio-circle">
                      <div className="radio-circle-inner" />
                    </div>
                    {option.label}
                  </button>
                ))}
              </div>

              {formData.secteur === 'autre' && (
                <input
                  type="text"
                  className="input-field input-field-small"
                  placeholder="Précisez votre secteur d'activité"
                  value={formData.secteurAutre}
                  onChange={(e) => setFormData({ ...formData, secteurAutre: e.target.value })}
                  autoFocus
                />
              )}
            </>
          )}

          {/* QUESTION 2 - CHIFFRE D'AFFAIRES */}
          {currentStep === 2 && (
            <>
              <h2 className="question-title">Quel est votre chiffre d'affaires annuel ?</h2>

              <div className="options-container">
                {caOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`option-button ${formData.chiffreAffaires === option.value ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, chiffreAffaires: option.value })}
                  >
                    <div className="radio-circle">
                      <div className="radio-circle-inner" />
                    </div>
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* QUESTION 3 - NOMBRE D'EMPLOYÉS */}
          {currentStep === 3 && (
            <>
              <h2 className="question-title">Combien d'employés compte votre entreprise ?</h2>

              <div className="options-container">
                {employesOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`option-button ${formData.nombreEmployes === option.value ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, nombreEmployes: option.value })}
                  >
                    <div className="radio-circle">
                      <div className="radio-circle-inner" />
                    </div>
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* QUESTION 4 - INTENSITÉ DU PROBLÈME */}
          {currentStep === 4 && (
            <>
              <h2 className="question-title">À quel point le temps perdu à chercher des informations est-il un problème pour votre entreprise ?</h2>

              <div className="slider-container">
                <div className="slider-value">{formData.intensiteProbleme}</div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.intensiteProbleme}
                  onChange={(e) => setFormData({ ...formData, intensiteProbleme: parseInt(e.target.value) })}
                  className="slider"
                />

                <div className="slider-labels">
                  <span>Pas un problème</span>
                  <span>Problème critique</span>
                </div>

                <div className="slider-scale">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <span key={n}>{n}</span>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* QUESTION 5 - COORDONNÉES */}
          {currentStep === 5 && (
            <>
              <h2 className="question-title">Quelles sont vos coordonnées ?</h2>

              <div className="fields-container">
                <div className="field-group">
                  <label className="field-label">Prénom</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Votre prénom"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    autoFocus
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Email</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="field-group">
                  <label className="field-label">Téléphone</label>
                  <div className="phone-input">
                    <select
                      className="phone-prefix"
                      value={formData.phonePrefix}
                      onChange={(e) => setFormData({ ...formData, phonePrefix: e.target.value })}
                    >
                      <option value="+33">+33</option>
                      <option value="+32">+32</option>
                      <option value="+41">+41</option>
                      <option value="+352">+352</option>
                      <option value="+1">+1</option>
                    </select>
                    <input
                      type="tel"
                      className="phone-number"
                      placeholder="6 12 34 56 78"
                      value={formData.phoneNumber}
                      onChange={(e) => {
                        // Garder seulement les chiffres
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 10)
                        // Formater : X XX XX XX XX
                        let formatted = ''
                        for (let i = 0; i < digits.length; i++) {
                          if (i === 1 || (i > 1 && (i - 1) % 2 === 0)) {
                            formatted += ' '
                          }
                          formatted += digits[i]
                        }
                        setFormData({ ...formData, phoneNumber: formatted })
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="buttons-container">
            {currentStep > 1 && (
              <button className="btn-back" onClick={handleBack}>
                Retour
              </button>
            )}
            <button
              className="btn-next"
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              {currentStep === 5 ? 'Accéder au calendrier →' : 'Suivant →'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
