'use client'

import { useState } from 'react'

export default function FormulairePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    interested: '',
    role: '',
    roleOther: '',
    businessDescription: '',
    toolsUsed: '',
    problems: [] as string[],
    problemsOther: '',
    budget: '',
    urgency: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  })

  const totalSteps = 7 // 6 questions + 1 coordonnées

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      problems: prev.problems.includes(value)
        ? prev.problems.filter(p => p !== value)
        : [...prev.problems, value]
    }))
  }

  const canGoNext = () => {
    switch(currentStep) {
      case 1: return formData.interested !== ''
      case 2: return formData.role !== '' && (formData.role !== 'Autre' || formData.roleOther !== '')
      case 3: return formData.role === 'Manager/Employé (je ne suis pas décisionnaire)' || formData.businessDescription !== ''
      case 4: return formData.toolsUsed !== ''
      case 5: return formData.problems.length > 0 && (!formData.problems.includes('Autre') || formData.problemsOther !== '')
      case 6: return formData.budget !== ''
      case 7: return formData.firstName !== '' && formData.lastName !== '' && formData.email !== '' && formData.phone !== ''
      default: return false
    }
  }

  const handleNext = () => {
    if (canGoNext()) {
      // Si on est à l'étape 2 et que c'est un manager, on saute l'étape 3
      if (currentStep === 2 && formData.role === 'Manager/Employé (je ne suis pas décisionnaire)') {
        setCurrentStep(4)
      } else {
        setCurrentStep(prev => prev + 1)
      }
    }
  }

  const handlePrevious = () => {
    // Si on est à l'étape 4 et qu'on revient en arrière depuis un manager, on va à l'étape 2
    if (currentStep === 4 && formData.role === 'Manager/Employé (je ne suis pas décisionnaire)') {
      setCurrentStep(2)
    } else {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.qualified) {
        window.location.href = '/merci-qualifie'
      } else {
        window.location.href = '/merci'
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const getActualStep = () => {
    if (currentStep <= 2) return currentStep
    if (currentStep === 4 && formData.role === 'Manager/Employé (je ne suis pas décisionnaire)') return 3
    if (formData.role === 'Manager/Employé (je ne suis pas décisionnaire)') return currentStep - 1
    return currentStep
  }

  const actualTotalSteps = formData.role === 'Manager/Employé (je ne suis pas décisionnaire)' ? 6 : 7

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <img 
            src="/logo.png" 
            alt="AIOS Logo" 
            className="h-10 w-auto"
          />
        </div>
      </header>

      {/* FORMULAIRE */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Barre de progression */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Question {getActualStep()} sur {actualTotalSteps}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round((getActualStep() / actualTotalSteps) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(getActualStep() / actualTotalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Question 1 - INTÉRESSÉ */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Êtes-vous vraiment intéressé par notre service ?
              </h2>
              <div className="space-y-3">
                {['Oui, je suis intéressé et je cherche une solution', 'Non, je suis juste curieux', 'Non, je ne suis pas intéressé'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition">
                    <input
                      type="radio"
                      name="interested"
                      value={option}
                      checked={formData.interested === option}
                      onChange={(e) => setFormData({...formData, interested: e.target.value})}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Question 2 - RÔLE */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Quel est votre rôle ?
              </h2>
              <div className="space-y-3">
                {[
                  'Dirigeant d\'une structure de services (1 personne - solopreneur)',
                  'Dirigeant d\'une structure de services (2-10 personnes)',
                  'Dirigeant d\'une structure de services (plus de 10 personnes)',
                  'Manager/Employé (je ne suis pas décisionnaire)',
                  'Autre'
                ].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition">
                    <input
                      type="radio"
                      name="role"
                      value={option}
                      checked={formData.role === option}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              {formData.role === 'Autre' && (
                <input
                  type="text"
                  placeholder="Précisez votre rôle..."
                  value={formData.roleOther}
                  onChange={(e) => setFormData({...formData, roleOther: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              )}
            </div>
          )}

          {/* Question 3 - DESCRIPTION ACTIVITÉ */}
          {currentStep === 3 && formData.role !== 'Manager/Employé (je ne suis pas décisionnaire)' && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Décrivez brièvement votre activité
              </h2>
              <input
                type="text"
                placeholder="Ex: Cabinet de conseil en transformation digitale, Agence marketing B2B..."
                value={formData.businessDescription}
                onChange={(e) => setFormData({...formData, businessDescription: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              />
            </div>
          )}

          {/* Question 4 - OUTILS */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Utilisez-vous des outils pour coordonner votre activité et gérer vos clients ?
              </h2>
              <div className="space-y-3">
                {[
                  'Oui, plusieurs outils (CRM, gestion projet, docs partagés, etc.)',
                  'Oui, 1-2 outils basiques (Excel, Gmail, Drive)',
                  'Non, tout est dans ma tête ou sur papier',
                  'On a essayé mais on n\'utilise plus'
                ].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition">
                    <input
                      type="radio"
                      name="toolsUsed"
                      value={option}
                      checked={formData.toolsUsed === option}
                      onChange={(e) => setFormData({...formData, toolsUsed: e.target.value})}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Question 5 - PROBLÈMES */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Quel(s) est/sont votre/vos plus gros problème(s) aujourd'hui ?
              </h2>
              <p className="text-gray-600">Plusieurs choix possibles</p>
              <div className="space-y-3">
                {[
                  'Temps perdu à chercher des informations',
                  'Difficile de coordonner l\'équipe (contexte dispersé)',
                  'Manque de vision stratégique sur mon activité',
                  'Préparation des rendez-vous clients trop longue',
                  'Autre'
                ].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition">
                    <input
                      type="checkbox"
                      value={option}
                      checked={formData.problems.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              {formData.problems.includes('Autre') && (
                <input
                  type="text"
                  placeholder="Précisez votre problème..."
                  value={formData.problemsOther}
                  onChange={(e) => setFormData({...formData, problemsOther: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              )}
            </div>
          )}

          {/* Question 6 - BUDGET */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Quel budget êtes-vous prêt à investir dans votre entreprise pour résoudre ce(s) problème(s) ?
              </h2>
              <div className="space-y-3">
                {[
                  'Moins de 1 500€',
                  '1 500€ - 3 000€',
                  '3 000€ - 5 000€',
                  '5 000€ - 10 000€',
                  'Plus de 10 000€',
                  'Je ne sais pas encore'
                ].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition">
                    <input
                      type="radio"
                      name="budget"
                      value={option}
                      checked={formData.budget === option}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Question 7 - URGENCE */}
          {currentStep === 7 && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Nous ne travaillons qu'avec 4 entreprises par mois pour garantir la qualité. Êtes-vous prêt à démarrer rapidement si sélectionné ?
              </h2>
              <div className="space-y-3">
                {[
                  'Oui, dès que possible (cette semaine)',
                  'Oui, mais dans 1 mois maximum',
                  'Non, je réfléchis encore / pas d\'urgence'
                ].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition">
                    <input
                      type="radio"
                      name="urgency"
                      value={option}
                      checked={formData.urgency === option}
                      onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* COORDONNÉES - Après l'urgence */}
          {currentStep === (formData.role === 'Manager/Employé (je ne suis pas décisionnaire)' ? 7 : 8) && (
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                Vos coordonnées
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse e-mail *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                <input
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Boutons de navigation */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition"
              >
                ← Précédent
              </button>
            )}
            
            {currentStep < (formData.role === 'Manager/Employé (je ne suis pas décisionnaire)' ? 7 : 8) && (
              <button
                onClick={handleNext}
                disabled={!canGoNext()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer →
              </button>
            )}

            {currentStep === (formData.role === 'Manager/Employé (je ne suis pas décisionnaire)' ? 7 : 8) && (
              <button
                onClick={handleSubmit}
                disabled={loading || !canGoNext()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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