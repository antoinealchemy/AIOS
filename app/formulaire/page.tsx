'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// DÉFINITION DES QUESTIONS
const INITIAL_QUESTION = {
  id: 'nameFields',
  label: 'Commençons par faire connaissance :',
  type: 'name',
  fields: [
    { id: 'firstName', label: 'Prénom', placeholder: 'Ex: Antoine' },
    { id: 'lastName', label: 'Nom', placeholder: 'Ex: Dubois' }
  ]
}

const QUESTIONS = [
  {
    id: 'interested',
    label: '{firstName}, êtes-vous vraiment intéressé par notre solution ?',
    type: 'radio',
    options: [
      'Oui, je suis intéressé et je cherche une solution',
      'Non, je suis juste curieux',
      'Non, je ne suis pas intéressé'
    ]
  },
  {
    id: 'activity',
    label: 'Quelle est votre activité ?',
    type: 'radio',
    options: [
      'Cabinet de conseil (stratégie, transformation digitale, management)',
      'Agence web / digitale',
      'Agence marketing / communication',
      'Cabinet d\'experts-comptables',
      'Autre'
    ],
    hasOther: true
  },
  {
    id: 'website',
    label: 'Quel est le site web de votre entreprise ?',
    type: 'website',
    placeholder: 'https://votre-entreprise.com',
    checkboxLabel: 'Je n\'ai pas de site web'
  },
  {
    id: 'role',
    label: 'Quel est votre rôle dans l\'entreprise ?',
    type: 'radio',
    options: [
      'Dirigeant / CEO / Fondateur',
      'Associé / Co-dirigeant',
      'Directeur (Marketing, Digital, Opérations, etc.)',
      'Manager / Employé',
      'Autre'
    ],
    hasOther: true
  },
  {
    id: 'budget',
    label: 'Quel budget êtes-vous prêt à investir pour cette solution ?',
    type: 'radio',
    options: [
      'Moins de 1 500€',
      '1 500€ - 3 000€',
      '3 000€ - 5 000€',
      '5 000€ - 10 000€',
      'Plus de 10 000€',
      'Je ne sais pas encore'
    ]
  }
]

const CONTACT_FIELDS = [
  { id: 'email', label: 'Adresse e-mail', type: 'email', required: true, validate: true },
  { id: 'phone', label: 'Téléphone', type: 'tel', placeholder: '06 12 34 56 78', required: true, international: true }
]

export default function FormulairePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [phoneCountry, setPhoneCountry] = useState('+33')
  const [formData, setFormData] = useState<any>({
    interested: '',
    activity: '',
    activityOther: '',
    website: '',
    noWebsite: false,
    role: '',
    roleOther: '',
    budget: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })

  const totalSteps = QUESTIONS.length + 2 // +1 pour nom/prénom, +1 pour contact

  const handleNameSubmit = () => {
    if (formData.firstName.trim() && formData.lastName.trim()) {
      setCurrentStep(1)
    }
  }

  const handleAnswerSelect = (questionId: string, value: any) => {
    setFormData({ ...formData, [questionId]: value })
  }

  const handleNext = () => {
    const question = QUESTIONS[currentStep - 1]
    
    // Validation pour la question website
    if (question?.id === 'website') {
      if (!formData.noWebsite && !formData.website.trim()) {
        return // Ne pas avancer si pas de site web ET checkbox non cochée
      }
    }
    
    // Validation pour les autres questions
    if (question?.type === 'radio' && !formData[question.id]) {
      return
    }
    
    if (question?.hasOther && formData[question.id] === 'Autre' && !formData[`${question.id}Other`]?.trim()) {
      return
    }
    
    setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\s/g, '')
    return cleaned.length >= 10
  }

  const handleSubmit = async () => {
    setEmailError('')
    setPhoneError('')

    if (!validateEmail(formData.email)) {
      setEmailError('Veuillez entrer une adresse e-mail valide')
      return
    }

    if (!validatePhone(formData.phone)) {
      setPhoneError('Veuillez entrer un numéro de téléphone valide')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: phoneCountry + formData.phone.replace(/\s/g, '')
        })
      })

      const result = await response.json()

      if (result.success) {
        // Redirection selon qualification
        if (result.qualified) {
          router.push('/merci-qualifie')
        } else {
          router.push('/merci')
        }
      } else {
        alert('Une erreur est survenue. Veuillez réessayer.')
        setLoading(false)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
      setLoading(false)
    }
  }

  const renderQuestion = () => {
    // ÉTAPE 0: Nom et prénom
    if (currentStep === 0) {
      return (
        <div className="question-container">
          <h2 className="question-title">{INITIAL_QUESTION.label}</h2>
          <div className="name-fields">
            {INITIAL_QUESTION.fields.map((field) => (
              <div key={field.id} className="input-group">
                <label>{field.label}</label>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={formData[field.id] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                  className="text-input"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleNameSubmit}
            disabled={!formData.firstName.trim() || !formData.lastName.trim()}
            className="btn-next"
          >
            Suivant
          </button>
        </div>
      )
    }

    // ÉTAPE FINALE: Contact
    if (currentStep === totalSteps - 1) {
      return (
        <div className="question-container">
          <h2 className="question-title">Dernière étape : comment peut-on vous recontacter ?</h2>
          
          <div className="contact-fields">
            <div className="input-group">
              <label>Adresse e-mail *</label>
              <input
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  setEmailError('')
                }}
                className={`text-input ${emailError ? 'error' : ''}`}
              />
              {emailError && <span className="error-message">{emailError}</span>}
            </div>

            <div className="input-group">
              <label>Numéro de téléphone *</label>
              <div className="phone-input-wrapper">
                <select
                  value={phoneCountry}
                  onChange={(e) => setPhoneCountry(e.target.value)}
                  className="phone-country"
                >
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+32">🇧🇪 +32</option>
                  <option value="+41">🇨🇭 +41</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                </select>
                <input
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value })
                    setPhoneError('')
                  }}
                  className={`text-input phone-number ${phoneError ? 'error' : ''}`}
                />
              </div>
              {phoneError && <span className="error-message">{phoneError}</span>}
            </div>
          </div>

          <div className="nav-buttons">
            <button onClick={handleBack} className="btn-back">Retour</button>
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.email || !formData.phone}
              className="btn-submit"
            >
              {loading ? 'Envoi en cours...' : 'Réserver mon appel'}
            </button>
          </div>
        </div>
      )
    }

    // QUESTIONS INTERMÉDIAIRES
    const question = QUESTIONS[currentStep - 1]
    const questionLabel = question.label.replace('{firstName}', formData.firstName)

    return (
      <div className="question-container">
        <h2 className="question-title">{questionLabel}</h2>

        {/* TYPE: RADIO */}
        {question.type === 'radio' && question.options && (
          <div className="options-list">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(question.id, option)}
                className={`option-button ${formData[question.id] === option ? 'selected' : ''}`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* CHAMP "AUTRE" pour radio */}
        {question.hasOther && formData[question.id] === 'Autre' && (
          <div className="input-group" style={{ marginTop: '16px' }}>
            <input
              type="text"
              placeholder="Précisez..."
              value={formData[`${question.id}Other`] || ''}
              onChange={(e) => setFormData({ ...formData, [`${question.id}Other`]: e.target.value })}
              className="text-input"
            />
          </div>
        )}

        {/* TYPE: WEBSITE */}
        {question.type === 'website' && (
          <div className="website-field">
            <input
              type="text"
              placeholder={question.placeholder}
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              disabled={formData.noWebsite}
              className="text-input"
            />
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.noWebsite}
                onChange={(e) => setFormData({ ...formData, noWebsite: e.target.checked, website: '' })}
              />
              <span>{question.checkboxLabel}</span>
            </label>
          </div>
        )}

        <div className="nav-buttons">
          <button onClick={handleBack} className="btn-back">Retour</button>
          <button
            onClick={handleNext}
            disabled={
              (question.type === 'radio' && !formData[question.id]) ||
              (question.hasOther && formData[question.id] === 'Autre' && !formData[`${question.id}Other`]?.trim()) ||
              (question.type === 'website' && !formData.noWebsite && !formData.website.trim())
            }
            className="btn-next"
          >
            Suivant
          </button>
        </div>
      </div>
    )
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
          background: #F8F8F8;
          color: #1a1a1a;
          line-height: 1.6;
        }

        .form-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .form-header {
          background: white;
          padding: 20px 24px;
          border-bottom: 1px solid #E5E7EB;
        }

        .header-content {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-link {
          display: flex;
          align-items: center;
        }

        .logo-img {
          height: 40px;
          width: auto;
        }

        .progress-bar-container {
          flex: 1;
          max-width: 300px;
          margin-left: 40px;
        }

        .progress-text {
          font-size: 13px;
          color: #6C6C6C;
          margin-bottom: 8px;
          text-align: right;
        }

        .progress-bar {
          height: 8px;
          background: #E5E7EB;
          border-radius: 8px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
          transition: width 0.3s ease;
        }

        /* Main Content */
        .form-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
        }

        .question-container {
          width: 100%;
          max-width: 600px;
          background: white;
          padding: 48px;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
        }

        .question-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 32px;
          line-height: 1.3;
        }

        /* Name Fields */
        .name-fields {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
        }

        .input-group {
          flex: 1;
        }

        .input-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 8px;
        }

        .text-input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #E5E7EB;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.2s;
        }

        .text-input:focus {
          outline: none;
          border-color: #3B82F6;
        }

        .text-input.error {
          border-color: #EF4444;
        }

        .error-message {
          display: block;
          color: #EF4444;
          font-size: 13px;
          margin-top: 6px;
        }

        /* Options List */
        .options-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
        }

        .option-button {
          width: 100%;
          padding: 16px 20px;
          background: white;
          border: 2px solid #E5E7EB;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          color: #1a1a1a;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .option-button:hover {
          border-color: #3B82F6;
          background: #F0F9FF;
        }

        .option-button.selected {
          border-color: #3B82F6;
          background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
          color: white;
        }

        /* Website Field */
        .website-field {
          margin-bottom: 32px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
          cursor: pointer;
          font-size: 14px;
          color: #6C6C6C;
        }

        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        /* Contact Fields */
        .contact-fields {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 32px;
        }

        .phone-input-wrapper {
          display: flex;
          gap: 8px;
        }

        .phone-country {
          padding: 14px 12px;
          border: 2px solid #E5E7EB;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          background: white;
        }

        .phone-number {
          flex: 1;
        }

        /* Navigation Buttons */
        .nav-buttons {
          display: flex;
          gap: 12px;
          margin-top: 32px;
        }

        .btn-back {
          padding: 14px 24px;
          background: white;
          border: 2px solid #E5E7EB;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #6C6C6C;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-back:hover {
          border-color: #3B82F6;
          color: #3B82F6;
        }

        .btn-next,
        .btn-submit {
          flex: 1;
          padding: 14px 24px;
          background: linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%);
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-next:hover,
        .btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }

        .btn-next:disabled,
        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .question-container {
            padding: 32px 24px;
          }

          .question-title {
            font-size: 24px;
          }

          .progress-bar-container {
            margin-left: 20px;
            max-width: 200px;
          }

          .header-content {
            flex-wrap: wrap;
          }
        }
      `}</style>

      <div className="form-page">
        {/* Header */}
        <header className="form-header">
          <div className="header-content">
            <a href="/" className="logo-link">
              <Image src="/logo.png" alt="AIOS" width={120} height={40} className="logo-img" />
            </a>
            <div className="progress-bar-container">
              <div className="progress-text">
                Étape {currentStep + 1} sur {totalSteps}
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="form-content">
          {renderQuestion()}
        </main>
      </div>
    </>
  )
}