'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import * as fbq from '../../lib/fbPixel'

export default function FormulairePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isCabinet: '',
    role: '',
    roleOther: '',
    douleur: 5,
    urgence: '',
    budget: ''
  })

  useEffect(() => {
    // Récupérer données optin
    const leadData = sessionStorage.getItem('leadData')
    if (leadData) {
      const data = JSON.parse(leadData)
      setFormData(prev => ({
        ...prev,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || ''
      }))
    }

    // Pixel Facebook
    fbq.customEvent('FormulairePage', {
      content_name: 'Formulaire Qualification'
    })
  }, [])

  const handleNext = () => {
    // QUESTION 1 - Cabinet avocat
    if (currentStep === 1) {
      if (formData.isCabinet === 'non') {
        // NON QUALIFIÉ - Pas cabinet avocat
        router.push('/non-qualifie')
        return
      }
      setCurrentStep(2)
      return
    }

    // QUESTION 2 - Rôle
    if (currentStep === 2) {
      if (formData.role !== 'dirigeant' && formData.role !== 'associe') {
        // NON QUALIFIÉ - Pas décisionnaire
        router.push('/non-qualifie')
        return
      }
      setCurrentStep(3)
      return
    }

    // QUESTION 3 - Douleur
    if (currentStep === 3) {
      setCurrentStep(4)
      return
    }

    // QUESTION 4 - Urgence
    if (currentStep === 4) {
      if (formData.urgence === 'pas-timing') {
        // NON QUALIFIÉ - Pas de timing
        router.push('/non-qualifie')
        return
      }
      setCurrentStep(5)
      return
    }

    // QUESTION 5 - Budget (dernière)
    if (currentStep === 5) {
      if (formData.budget === 'moins-1000') {
        // NON QUALIFIÉ - Budget trop faible
        router.push('/non-qualifie')
        return
      }
      
      // QUALIFIÉ - Toutes conditions remplies
      // Sauvegarder données complètes
      sessionStorage.setItem('leadQualified', JSON.stringify(formData))
      
      // Pixel Facebook Lead qualifié
      fbq.event('Lead', {
        content_name: 'Lead Qualifié',
        value: 4500,
        currency: 'EUR'
      })
      
      // Redirect Calendly
      router.push('/entretien1')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    if (currentStep === 1) return formData.isCabinet !== ''
    if (currentStep === 2) return formData.role !== '' && (formData.role !== 'autre' || formData.roleOther !== '')
    if (currentStep === 3) return true // Slider toujours valide
    if (currentStep === 4) return formData.urgence !== ''
    if (currentStep === 5) return formData.budget !== ''
    return false
  }

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
          margin-bottom: 8px;
          color: #1a1a1a;
        }

        .question-subtitle {
          font-size: 16px;
          color: #6C6C6C;
          margin-bottom: 32px;
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
          gap: 12px;
          padding: 16px 20px;
          border: 2px solid #E5E7EB;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 16px;
          text-align: left;
        }

        .option-button:hover {
          border-color: #3B82F6;
          background: #EFF6FF;
        }

        .option-button.selected {
          border-color: #3B82F6;
          background: #EFF6FF;
        }

        .option-button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .radio-circle {
          width: 24px;
          height: 24px;
          border: 2px solid #E5E7EB;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .option-button.selected .radio-circle {
          border-color: #3B82F6;
        }

        .radio-circle-inner {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #3B82F6;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .option-button.selected .radio-circle-inner {
          opacity: 1;
        }

        .text-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #E5E7EB;
          border-radius: 8px;
          font-size: 16px;
          margin-top: 12px;
        }

        .text-input:focus {
          outline: none;
          border-color: #3B82F6;
        }

        .slider-container {
          margin: 40px 0;
        }

        .slider {
          width: 100%;
          height: 8px;
          -webkit-appearance: none;
          appearance: none;
          background: #E5E7EB;
          border-radius: 999px;
          outline: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          background: #3B82F6;
          border-radius: 50%;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #3B82F6;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        .slider-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          font-size: 14px;
          color: #6C6C6C;
        }

        .slider-value {
          text-align: center;
          font-size: 48px;
          font-weight: 700;
          color: #3B82F6;
          margin-bottom: 16px;
        }

        .buttons-container {
          display: flex;
          gap: 12px;
          margin-top: 32px;
        }

        .btn-back {
          padding: 14px 28px;
          border: 2px solid #E5E7EB;
          border-radius: 8px;
          background: white;
          color: #6C6C6C;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-back:hover {
          border-color: #3B82F6;
          color: #3B82F6;
        }

        .btn-next {
          flex: 1;
          padding: 14px 28px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-next:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .btn-next:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 768px) {
          .form-card {
            padding: 24px;
          }

          .question-title {
            font-size: 20px;
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
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        <div className="form-card">
          {/* QUESTION 1 - CABINET AVOCAT */}
          {currentStep === 1 && (
            <>
              <h2 className="question-title">Travaillez-vous dans un cabinet d'avocats ?</h2>
              <p className="question-subtitle">Cette solution est spécialement conçue pour les cabinets d'avocats</p>
              
              <div className="options-container">
                <button
                  className={`option-button ${formData.isCabinet === 'oui' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, isCabinet: 'oui' })}
                >
                  <div className="radio-circle">
                    <div className="radio-circle-inner" />
                  </div>
                  ✅ Oui, je travaille dans un cabinet d'avocats
                </button>

                <button
                  className={`option-button ${formData.isCabinet === 'non' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, isCabinet: 'non' })}
                >
                  <div className="radio-circle">
                    <div className="radio-circle-inner" />
                  </div>
                  ❌ Non, je travaille dans un autre secteur
                </button>
              </div>
            </>
          )}

          {/* QUESTION 2 - RÔLE */}
          {currentStep === 2 && (
            <>
              <h2 className="question-title">Quel est votre rôle dans le cabinet ?</h2>
              <p className="question-subtitle">Cette solution nécessite une décision au niveau direction</p>
              
              <div className="options-container">
                <button
                  className={`option-button ${formData.role === 'dirigeant' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'dirigeant' })}
                >
                  <div className="radio-circle">
                    <div className="radio-circle-inner" />
                  </div>
                  ✅ Dirigeant
                </button>

                <button
                  className={`option-button ${formData.role === 'associe' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'associe' })}
                >
                  <div className="radio-circle">
                    <div className="radio-circle-inner" />
                  </div>
                  ✅ Associé
                </button>

                <button
                  className={`option-button ${formData.role === 'collaborateur' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'collaborateur' })}
                >
                  <div className="radio-circle">
                    <div className="radio-circle-inner" />
                  </div>
                  ❌ Collaborateur salarié
                </button>

                <button
                  className={`option-button ${formData.role === 'junior' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'junior' })}
                >
                  <div className="radio-circle">
                    <div className="radio-circle-inner" />
                  </div>
                  ❌ Avocat junior
                </button>

                <button
                  className={`option-button ${formData.role === 'autre' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, role: 'autre' })}
                >
                  <div className="radio-circle">
                    <div className="radio-circle-inner" />
                  </div>
                  ❌ Autre (précisez ci-dessous)
                </button>

                {formData.role === 'autre' && (
                  <input
                    type="text"
                    className="text-input"
                    placeholder="Précisez votre rôle..."
                    value={formData.roleOther}
                    onChange={(e) => setFormData({ ...formData, roleOther: e.target.value })}
                  />
                )}
              </div>
            </>
          )}

          {/* QUESTION 3 - DOULEUR */}
          {currentStep === 3 && (
            <>
              <h2 className="question-title">À quel point ce problème vous impacte-t-il ?</h2>
              <p className="question-subtitle">Perdre 20-30h/semaine en recherches non facturables</p>
              
              <div className="slider-container">
                <div className="slider-value">{formData.douleur}/10</div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.douleur}
                  className="slider"
                  onChange={(e) => setFormData({ ...formData, douleur: parseInt(e.target.value) })}
                />
                <div className="slider-labels">
                  <span>Pas un problème</span>
                  <span>Très critique</span>
                </div>
              </div>
            </>
          )}

          {/* QUESTION 4 - URGENCE */}
          {currentStep === 4 && (
            <>
              <h2 className="question-title">Si cette solution ne vous demandait qu'1 heure de votre temps...</h2>
              <p className="question-subtitle">Quand voudriez-vous résoudre ce problème ?</p>
              
              <div className="options-container">
                <button
                  className={`option-button ${formData.urgence === 'immediat' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, urgence: 'immediat' })}
                >
                  <div className="radio-circle">
                    <div className="radio-circle-inner" />
                  </div>
                  Le plus vite possible (moins de 2 semaines)
                </button>

                <button
                  className={`option-button ${formData.urgence === '1-mois' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, urgence: '1-mois' })}
                >
                  <div className="radio-circle">
                    <div className="radio-circle-inner" />
                  </div>
                  D'ici 1 mois
                </button>

                <button
                  className={`option-button ${formData.urgence === '3-mois' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, urgence: '3-mois' })}
                >
                  <div className="radio-circle">
                    <div className="radio-circle-inner" />
                  </div>
                  D'ici 3 mois
                </button>

                <button
                  className={`option-button ${formData.urgence === 'pas-timing' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, urgence: 'pas-timing' })}
                >
                  <div className="radio-circle">
                    <div className="radio-circle-inner" />
                  </div>
                  ❌ Pas de timing précis, je me renseigne
                </button>
              </div>
            </>
          )}

          {/* QUESTION 5 - BUDGET */}
          {currentStep === 5 && (
            <>
              <h2 className="question-title">Quel budget pour récupérer 20h/semaine ?</h2>
              <p className="question-subtitle">Soit ~100k€/an de CA additionnel potentiel</p>
              
              <div className="options-container">
                <button
                  className={`option-button ${formData.budget === 'moins-1000' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, budget: 'moins-1000' })}
                >
                  <div className="radio-circle">
                    <div className="radio-circle-inner" />
                  </div>
                  ❌ Moins de 1 000€
                </button>

                <button
                  className={`option-button ${formData.budget === '1000-3000' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, budget: '1000-3000' })}
                >
                  <div className="radio-circle">
                    <div className="radio-circle-inner" />
                  </div>
                  1 000€ - 3 000€
                </button>

                <button
                  className={`option-button ${formData.budget === '3000-5000' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, budget: '3000-5000' })}
                >
                  <div className="radio-circle">
                    <div className="radio-circle-inner" />
                  </div>
                  ✅ 3 000€ - 5 000€
                </button>

                <button
                  className={`option-button ${formData.budget === '5000-10000' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, budget: '5000-10000' })}
                >
                  <div className="radio-circle">
                    <div className="radio-circle-inner" />
                  </div>
                  ✅ 5 000€ - 10 000€
                </button>

                <button
                  className={`option-button ${formData.budget === 'plus-10000' ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, budget: 'plus-10000' })}
                >
                  <div className="radio-circle">
                    <div className="radio-circle-inner" />
                  </div>
                  ✅ Plus de 10 000€
                </button>
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
              {currentStep === 5 ? 'Valider' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}