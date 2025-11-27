'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function FormulairePage() {
  const router = useRouter()
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

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      problems: prev.problems.includes(value)
        ? prev.problems.filter(p => p !== value)
        : [...prev.problems, value]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.qualified) {
        router.push('/merci-qualifie')
      } else {
        router.push('/merci')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* HEADER */}
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

      {/* FORMULAIRE */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Vérifiez votre éligibilité
          </h1>
          <p className="text-gray-600 mb-8">
            Répondez à ces quelques questions pour voir si AIOS peut vous aider.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Q1 - INTÉRESSÉ */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Êtes-vous vraiment intéressé par notre service ?
              </label>
              <div className="space-y-2">
                {['Oui, je suis intéressé et je cherche une solution', 'Non, je suis juste curieux', 'Non, je ne suis pas intéressé'].map((option) => (
                  <label key={option} className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 transition">
                    <input
                      type="radio"
                      name="interested"
                      value={option}
                      checked={formData.interested === option}
                      onChange={(e) => setFormData({...formData, interested: e.target.value})}
                      required
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q2 - RÔLE */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Quel est votre rôle ?
              </label>
              <div className="space-y-2">
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
                      required
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
                  required
                  className="mt-3 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              )}
            </div>

            {/* Q3 - DESCRIPTION ACTIVITÉ */}
            {formData.role && formData.role !== 'Manager/Employé (je ne suis pas décisionnaire)' && (
              <div>
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Décrivez brièvement votre activité
                </label>
                <input
                  type="text"
                  placeholder="Ex: Cabinet de conseil en transformation digitale, Agence marketing B2B..."
                  value={formData.businessDescription}
                  onChange={(e) => setFormData({...formData, businessDescription: e.target.value})}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}

            {/* Q4 - OUTILS */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Utilisez-vous des outils pour coordonner votre activité et gérer vos clients ?
              </label>
              <div className="space-y-2">
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
                      required
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q5 - PROBLÈMES (MULTI-CHOIX) */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Quel(s) est/sont votre/vos plus gros problème(s) aujourd'hui ? (Plusieurs choix possibles)
              </label>
              <div className="space-y-2">
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
                  required
                  className="mt-3 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              )}
            </div>

            {/* Q6 - BUDGET */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Quel budget êtes-vous prêt à investir dans votre entreprise pour résoudre ce(s) problème(s) ?
              </label>
              <div className="space-y-2">
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
                      required
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Q7 - URGENCE */}
            <div>
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Nous ne travaillons qu'avec 4 entreprises par mois pour garantir la qualité. Êtes-vous prêt à démarrer rapidement si sélectionné ?
              </label>
              <div className="space-y-2">
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
                      required
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="ml-3 text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* COORDONNÉES */}
            <div className="border-t-2 border-gray-200 pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Vos coordonnées</h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse e-mail *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
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
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* BOUTON SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg py-4 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Envoi en cours...' : 'Vérifier mon éligibilité →'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}