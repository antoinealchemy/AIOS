'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import * as fbq from '../../lib/fbPixel'

export default function FormulairePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    secteur: '',
    secteurAutre: '',
    chiffreAffaires: '',
    nombreEmployes: '',
    intensiteProbleme: 5
  })

  useEffect(() => {
    // Pixel Facebook
    try {
      fbq.customEvent('FormulairePage', {
        content_name: 'Formulaire Qualification'
      })
    } catch (e) {}
  }, [])

  // Fonction pour sauvegarder dans Supabase
  const saveToSupabase = async () => {
    const dataToSend = {
      email: 'formulaire_qualification@temp.com', // Email temporaire, sera mis à jour via Calendly
      secteur: formData.secteur,
      secteur_autre: formData.secteur === 'autre' ? formData.secteurAutre : null,
      chiffre_affaires: formData.chiffreAffaires,
      nombre_employes: formData.nombreEmployes,
      intensite_probleme: formData.intensiteProbleme,
      current_step: 4,
      form_completed: true,
      qualified: true
    }

    console.log('📤 [FORMULAIRE] Données envoyées à Supabase:', JSON.stringify(dataToSend, null, 2))

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      })

      const result = await response.json()
      console.log('📥 [FORMULAIRE] Réponse Supabase:', JSON.stringify(result, null, 2))

      if (!response.ok) {
        console.error('❌ [FORMULAIRE] Erreur Supabase:', result.error)
        return null
      }

      console.log('✅ [FORMULAIRE] Lead sauvegardé avec ID:', result.leadId)
      return result
    } catch (error) {
      console.error('❌ [FORMULAIRE] Erreur fetch:', error)
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
      setCurrentStep(2)
      return
    }

    // QUESTION 2 - Chiffre d'affaires
    if (currentStep === 2) {
      if (!formData.chiffreAffaires) {
        alert('Veuillez sélectionner votre chiffre d\'affaires')
        return
      }
      setCurrentStep(3)
      return
    }

    // QUESTION 3 - Nombre d'employés
    if (currentStep === 3) {
      if (!formData.nombreEmployes) {
        alert('Veuillez sélectionner le nombre d\'employés')
        return
      }
      setCurrentStep(4)
      return
    }

    // QUESTION 4 - Intensité du problème (dernière)
    if (currentStep === 4) {
      console.log('🚀 [FORMULAIRE] Soumission finale - FormData:', JSON.stringify(formData, null, 2))

      // Sauvegarder dans Supabase
      const result = await saveToSupabase()

      // Sauvegarder données complètes en local aussi
      sessionStorage.setItem('leadQualified', JSON.stringify({
        ...formData,
        leadId: result?.leadId
      }))

      // Pixel Facebook Lead qualifié
      fbq.event('Lead', {
        content_name: 'Lead Qualifié',
        value: 4500,
        currency: 'EUR'
      })

      // Redirect Calendly
      router.push('/calendly')
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
    return false
  }

  // Calcul progression (4 étapes au total)
  const progressPercentage = (currentStep / 4) * 100

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
    { value: '1-10', label: '1 à 10' },
    { value: '11-50', label: '11 à 50' },
    { value: '51-200', label: '51 à 200' },
    { value: 'plus-200', label: 'Plus de 200' }
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

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #E5E7EB;
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 32px;
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
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
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
              {currentStep === 4 ? 'Valider' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
