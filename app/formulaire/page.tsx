'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// DÉFINITION DES QUESTIONS
const QUESTIONS = [
  {
    id: 'interested',
    label: 'Êtes-vous vraiment intéressé par notre service ?',
    type: 'radio',
    options: [
      'Oui, je suis intéressé et je cherche une solution',
      'Non, je suis juste curieux',
      'Non, je ne suis pas intéressé'
    ]
  },
  {
    id: 'role',
    label: 'Quel est votre rôle ?',
    type: 'radio',
    options: [
      'Dirigeant d\'une structure de services (1 personne - solopreneur)',
      'Dirigeant d\'une structure de services (2-10 personnes)',
      'Dirigeant d\'une structure de services (plus de 10 personnes)',
      'Manager/Employé (je ne suis pas décisionnaire)',
      'Autre'
    ],
    hasOther: true
  },
  {
    id: 'businessDescription',
    label: 'Décrivez brièvement votre activité',
    type: 'text',
    placeholder: 'Ex: Cabinet de conseil en transformation digitale, Agence marketing B2B...',
    conditional: (data: any) => data.role && data.role !== 'Manager/Employé (je ne suis pas décisionnaire)'
  },
  {
    id: 'toolsUsed',
    label: 'Utilisez-vous des outils pour coordonner votre activité et gérer vos clients ?',
    type: 'radio',
    options: [
      'Oui, plusieurs outils (CRM, gestion projet, docs partagés, etc.)',
      'Oui, 1-2 outils basiques (Excel, Gmail, Drive)',
      'Non, tout est dans ma tête ou sur papier',
      'On a essayé mais on n\'utilise plus'
    ]
  },
  {
    id: 'problems',
    label: 'Quel(s) est/sont votre/vos plus gros problème(s) aujourd\'hui ? (Plusieurs choix possibles)',
    type: 'checkbox',
    options: [
      'Temps perdu à chercher des informations',
      'Difficile de coordonner l\'équipe (contexte dispersé)',
      'Manque de vision stratégique sur mon activité',
      'Préparation des rendez-vous clients trop longue',
      'Autre'
    ],
    hasOther: true
  },
  {
    id: 'budget',
    label: 'Quel budget êtes-vous prêt à investir dans votre entreprise pour résoudre ce(s) problème(s) ?',
    type: 'radio',
    options: [
      'Moins de 1 500€',
      '1 500€ - 3 000€',
      '3 000€ - 5 000€',
      '5 000€ - 10 000€',
      'Plus de 10 000€',
      'Je ne sais pas encore'
    ]
  },
  {
    id: 'urgency',
    label: 'Nous ne travaillons qu\'avec 4 entreprises par mois pour garantir la qualité. Êtes-vous prêt à démarrer rapidement si sélectionné ?',
    type: 'radio',
    options: [
      'Oui, dès que possible (cette semaine)',
      'Oui, mais dans 1 mois maximum',
      'Non, je réfléchis encore / pas d\'urgence'
    ]
  }
]

const CONTACT_FIELDS = [
  { id: 'firstName', label: 'Prénom', type: 'text', required: true },
  { id: 'lastName', label: 'Nom', type: 'text', required: true },
  { id: 'email', label: 'Adresse e-mail', type: 'email', required: true, validate: true },
  { id: 'phone', label: 'Téléphone', type: 'tel', placeholder: '6 12 34 56 78', required: true, international: true }
]

export default function FormulairePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [phoneCountry, setPhoneCountry] = useState('+33')
  const [formData, setFormData] = useState<any>({
    interested: '',
    role: '',
    roleOther: '',
    businessDescription: '',
    toolsUsed: '',
    problems: [],
    problemsOther: '',
    budget: '',
    urgency: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })

  // FILTRER LES QUESTIONS SELON CONDITIONS
  const activeQuestions = QUESTIONS.filter(q => {
    if (q.conditional) {
      return q.conditional(formData)
    }
    return true
  })

  const totalSteps = activeQuestions.length
  const isContactStep = currentStep >= totalSteps
  const currentQuestion = activeQuestions[currentStep]

  // CALCULER LA PROGRESSION
  const progress = isContactStep 
    ? 100 
    : Math.round(((currentStep + 1) / (totalSteps + 1)) * 100)

  // VÉRIFIER SI L'ÉTAPE ACTUELLE EST VALIDE
  const isCurrentStepValid = () => {
    if (isContactStep) {
      const hasAllFields = formData.firstName && formData.lastName && formData.email && formData.phone
      const noEmailError = !emailError
      return hasAllFields && noEmailError
    }

    const question = currentQuestion
    const value = formData[question.id]

    if (question.type === 'checkbox') {
      return value && value.length > 0
    }

    if (question.type === 'text') {
      return value && value.trim().length > 0
    }

    if (question.hasOther && value === 'Autre') {
      const otherValue = formData[`${question.id}Other`]
      return otherValue && otherValue.trim().length > 0
    }

    return value && value !== ''
  }

  // VALIDER EMAIL (format basique uniquement)
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('Format d\'email invalide')
      return false
    }
    
    setEmailError('')
    return true
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
    
    // Validation email en temps réel
    if (field === 'email' && value) {
      validateEmail(value)
    }
  }

  const handleCheckboxChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v: string) => v !== value)
        : [...prev[field], value]
    }))
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

    setLoading(true)

    try {
      // FORMATER LE NUMÉRO DE TÉLÉPHONE AVEC CODE PAYS
      const fullPhone = `${phoneCountry}${formData.phone.replace(/^0/, '')}`
      
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: fullPhone
        })
      })

      const data = await response.json()

      // STOCKER LES DONNÉES DU LEAD DANS SESSIONSTORAGE POUR PRÉ-REMPLISSAGE CALENDLY
      sessionStorage.setItem('leadData', JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: fullPhone
      }))

      // REDIRECTION SELON QUALIFICATION
      if (data.qualified) {
        router.push('/merci-qualifie')
      } else {
        router.push('/merci')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
      setLoading(false)
    }
  }

  // RENDER QUESTION
  const renderQuestion = () => {
    if (isContactStep) {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Vos coordonnées</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {CONTACT_FIELDS.map((field) => {
              if (field.id === 'phone') {
                return (
                  <div key={field.id} className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label} {field.required && '*'}
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
                        <option value="+49">🇩🇪 +49</option>
                        <option value="+34">🇪🇸 +34</option>
                        <option value="+39">🇮🇹 +39</option>
                      </select>
                      <input
                        type="tel"
                        value={formData[field.id]}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )
              }
              
              return (
                <div key={field.id} className={field.id === 'email' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label} {field.required && '*'}
                  </label>
                  <input
                    type={field.type}
                    value={formData[field.id]}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none ${
                      field.id === 'email' && emailError 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-blue-500'
                    }`}
                  />
                  {field.id === 'email' && emailError && (
                    <p className="mt-1 text-sm text-red-600">{emailError}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    const question = currentQuestion

    return (
      <div>
        <label className="block text-xl md:text-2xl font-bold text-gray-900 mb-6">
          {question.label}
        </label>

        {question.type === 'radio' && (
          <div className="space-y-3">
            {question.options?.map((option) => (
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

        {question.type === 'checkbox' && (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label
                key={option}
                className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition-all"
              >
                <input
                  type="checkbox"
                  value={option}
                  checked={formData[question.id].includes(option)}
                  onChange={() => handleCheckboxChange(question.id, option)}
                  className="w-5 h-5 text-blue-600 rounded"
                />
                <span className="ml-3 text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )}

        {question.type === 'text' && (
          <input
            type="text"
            value={formData[question.id]}
            onChange={(e) => handleChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
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

        {question.hasOther && question.type === 'checkbox' && formData[question.id].includes('Autre') && (
          <input
            type="text"
            placeholder="Précisez votre problème..."
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
                {isContactStep 
                  ? 'Coordonnées' 
                  : `Question ${currentStep + 1} sur ${totalSteps}`}
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
                Continuer →
              </button>
            )}

            {isContactStep && (
              <button
                onClick={handleSubmit}
                disabled={!isCurrentStepValid() || loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Envoi en cours...' : 'Vérifier mon éligibilité →'}
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}