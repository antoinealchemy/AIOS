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
    id: 'activity',
    label: '{firstName}, quelle est votre activité principale ?',
    type: 'radio',
    options: [
      'Cabinet de conseil',
      'Cabinet d\'experts-comptables',
      'Cabinet d\'avocats',
      'Autre'
    ],
    hasOther: true
  },
  {
    id: 'teamSize',
    label: 'Combien de personnes dans votre équipe ?',
    type: 'radio',
    options: [
      '2-4 personnes',
      '5-10 personnes',
      '11+ personnes',
      'Solo'
    ]
  },
  {
    id: 'revenue',
    label: 'Quel est le chiffre d\'affaires approximatif que vous réalisez ?',
    type: 'radio',
    options: [
      '0-100K€',
      '100-200K€',
      '200-500K€',
      '500K-1M€',
      '1M€+'
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
    activity: '',
    activityOther: '',
    teamSize: '',
    revenue: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })

  const totalSteps = QUESTIONS.length + 2 // +1 pour nom/prénom, +1 pour contact
  const isNameStep = currentStep === 0
  const isContactStep = currentStep >= totalSteps - 1
  const currentQuestion = !isNameStep && !isContactStep ? QUESTIONS[currentStep - 1] : null

  // CALCULER LA PROGRESSION
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100)

  // VÉRIFIER SI L'ÉTAPE ACTUELLE EST VALIDE
  const isCurrentStepValid = () => {
    if (isNameStep) {
      return formData.firstName?.trim() && formData.lastName?.trim()
    }

    if (isContactStep) {
      return formData.email && formData.phone && !emailError && !phoneError
    }

    if (!currentQuestion) return false

    const question = currentQuestion
    const value = formData[question.id]

    if (question.type === 'radio') {
      if (!value) return false
      if (question.hasOther && value === 'Autre') {
        return formData[`${question.id}Other`]?.trim()
      }
      return true
    }

    return false
  }

  // VALIDATION EMAIL
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('Format d\'email invalide')
      return false
    }
    setEmailError('')
    return true
  }

  // VALIDATION TÉLÉPHONE
  const validatePhone = (phone: string, countryCode: string) => {
    if (!phone || !countryCode) {
      setPhoneError('')
      return false
    }
    
    const cleanPhone = phone.replace(/[\s\-\.]/g, '')
    
    if (countryCode === '+33') {
      const phoneRegex = /^0?[1-9]\d{8}$/
      if (!phoneRegex.test(cleanPhone)) {
        setPhoneError('Numéro français invalide (10 chiffres attendus)')
        return false
      }
    } else {
      if (cleanPhone.length < 8) {
        setPhoneError('Numéro de téléphone trop court')
        return false
      }
    }
    
    setPhoneError('')
    return true
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
    
    if (field === 'email' && value && typeof value === 'string') {
      if (value.includes('@') && value.split('@')[1]?.includes('.')) {
        validateEmail(value)
      } else {
        setEmailError('')
      }
    }
    
    if (field === 'phone' && value && typeof value === 'string') {
      const cleanPhone = value.replace(/[\s\-\.]/g, '')
      if (cleanPhone.length >= 8) {
        validatePhone(value, phoneCountry)
      } else {
        setPhoneError('')
      }
    }
  }

  const handleNext = () => {
    if (isCurrentStepValid()) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  // SOUMISSION FINALE
  const handleSubmit = async () => {
    if (!isCurrentStepValid()) return

    const phoneValid = validatePhone(formData.phone, phoneCountry)
    if (!phoneValid) return

    setLoading(true)

    try {
      const fullPhone = `${phoneCountry}${formData.phone.replace(/^0/, '').replace(/[\s\-\.]/g, '')}`
      
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: fullPhone
        })
      })

      const data = await response.json()

      sessionStorage.setItem('leadData', JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: fullPhone
      }))

      // REDIRECTION SELON QUALIFICATION
      if (data.qualified) {
        router.push('/entretien1')
      } else {
        router.push('/entretien2')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
      setLoading(false)
    }
  }

  // RENDER QUESTION
  const renderQuestion = () => {
    // ÉTAPE 1 : PRÉNOM + NOM
    if (isNameStep) {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            {INITIAL_QUESTION.label}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {INITIAL_QUESTION.fields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label} *
                </label>
                <input
                  type="text"
                  value={formData[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )
    }

    // ÉTAPE FINALE : EMAIL + TÉLÉPHONE
    if (isContactStep) {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {formData.firstName}, dernière étape : vos coordonnées
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse e-mail *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="votre@email.com"
                required
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                  emailError 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de téléphone *
              </label>
              <div className="flex gap-2">
                <select
                  value={phoneCountry}
                  onChange={(e) => setPhoneCountry(e.target.value)}
                  className="w-28 px-3 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none appearance-none bg-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+32">🇧🇪 +32</option>
                  <option value="+41">🇨🇭 +41</option>
                  <option value="+352">🇱🇺 +352</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                </select>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="06 12 34 56 78"
                  required
                  className={`flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none ${
                    phoneError 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
              </div>
              {phoneError && (
                <p className="mt-1 text-sm text-red-600">{phoneError}</p>
              )}
            </div>
          </div>
        </div>
      )
    }

    // QUESTIONS STANDARDS
    if (!currentQuestion) return null
    
    const question = currentQuestion
    const personalizedLabel = question.label.replace('{firstName}', formData.firstName || 'Prénom')

    return (
      <div>
        <label className="block text-xl md:text-2xl font-bold text-gray-900 mb-6">
          {personalizedLabel}
        </label>

        {question.type === 'radio' && question.options && (
          <div className="space-y-3">
            {question.options.map((option) => (
              <label
                key={option}
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-all"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={formData[question.id] === option}
                  onChange={(e) => handleChange(question.id, e.target.value)}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.hasOther && formData[question.id] === 'Autre' && (
          <input
            type="text"
            placeholder="Précisez..."
            value={formData[`${question.id}Other`]}
            onChange={(e) => handleChange(`${question.id}Other`, e.target.value)}
            className="mt-3 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Image 
            src="/logo.png" 
            alt="AIOS Logo" 
            width={120} 
            height={40}
            className="h-10 w-auto"
          />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Étape {currentStep + 1} sur {totalSteps}
              </span>
              <span className="text-sm font-medium text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mb-8">
            {renderQuestion()}
          </div>

          <div className="flex gap-4">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                disabled={loading}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                ← Précédent
              </button>
            )}

            {!isContactStep && (
              <button
                onClick={handleNext}
                disabled={!isCurrentStepValid() || loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant →
              </button>
            )}

            {isContactStep && (
              <button
                onClick={handleSubmit}
                disabled={!isCurrentStepValid() || loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Envoi en cours...' : 'Réserver mon appel →'}
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}