import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log('📥 Données reçues:', {
      email: data.email,
      step: data.current_step,
      cabinet: data.is_cabinet,
      role: data.role,
      qualified: data.qualified
    })

    // PRÉPARER DONNÉES LEAD (accepter null pour champs non remplis)
    const leadData: any = {
      email: data.email,
      first_name: data.first_name || null,
      last_name: data.last_name || null,
      phone: data.phone || null,
      current_step: data.current_step,
      
      // ⭐ NOUVEAU: Distinction form_completed vs completed (rétrocompatibilité)
      form_completed: data.form_completed !== undefined ? data.form_completed : data.completed,
      
      qualified: data.qualified,
      pixel_sent: data.pixel_sent || false
    }

    // Ajouter champs qualification seulement s'ils existent
    if (data.is_cabinet !== null && data.is_cabinet !== undefined) {
      leadData.is_cabinet = data.is_cabinet
    }
    if (data.role) {
      leadData.role = data.role
    }
    if (data.douleur_score !== null && data.douleur_score !== undefined) {
      // Convertir en string si number (schéma unifié)
      leadData.douleur_score = typeof data.douleur_score === 'number'
        ? data.douleur_score.toString()
        : data.douleur_score
    }
    if (data.budget) {
      leadData.budget = data.budget
    }
    if (data.urgence) {
      leadData.urgence = data.urgence
    }

    // NOUVEAUX CHAMPS - Formulaire v2
    if (data.secteur) {
      leadData.secteur = data.secteur
    }
    if (data.secteur_autre) {
      leadData.secteur_autre = data.secteur_autre
    }
    if (data.chiffre_affaires) {
      leadData.chiffre_affaires = data.chiffre_affaires
    }
    if (data.nombre_employes) {
      leadData.nombre_employes = data.nombre_employes
    }
    if (data.intensite_probleme !== null && data.intensite_probleme !== undefined) {
      leadData.intensite_probleme = data.intensite_probleme
    }

    // ⭐ NOUVEAU: Tracking optin (système unifié)
    if (data.optin_completed !== undefined) {
      leadData.optin_completed = data.optin_completed
    }
    if (data.optin_source) {
      leadData.optin_source = data.optin_source
    }

    // ⭐ NOUVEAU: Lead score
    if (data.lead_score) {
      leadData.lead_score = data.lead_score
    }

    // ⭐ NOUVEAU: UTM tracking
    if (data.utm_source) leadData.utm_source = data.utm_source
    if (data.utm_medium) leadData.utm_medium = data.utm_medium
    if (data.utm_campaign) leadData.utm_campaign = data.utm_campaign

    console.log('💾 Données à sauvegarder:', leadData)

    // VÉRIFIER SI LEAD EXISTE DÉJÀ (par email)
    const { data: existingLead, error: selectError } = await supabase
      .from('leads')
      .select('id, optin_completed, first_name, phone')
      .eq('email', data.email)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('❌ Erreur SELECT:', selectError)
    }

    let result

    if (existingLead) {
      // UPDATE lead existant
      console.log('🔄 UPDATE lead existant:', existingLead.id)
      
      // ⭐ NOUVEAU: Protection données optin
      // Ne pas écraser données optin si elles existent déjà
      if (existingLead.optin_completed && !data.optin_completed) {
        delete leadData.optin_completed
        delete leadData.optin_source
      }

      // ⭐ NOUVEAU: Protection données personnelles
      // Ne pas écraser first_name/phone si déjà remplis et nouveaux sont génériques
      if (existingLead.first_name && data.first_name === 'Test') {
        delete leadData.first_name
      }
      if (existingLead.phone && !data.phone) {
        delete leadData.phone
      }
      
      const { data: updatedLead, error } = await supabase
        .from('leads')
        .update(leadData)
        .eq('id', existingLead.id)
        .select()
        .single()

      if (error) {
        console.error('❌ Erreur UPDATE Supabase:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      result = updatedLead
      console.log('✅ Lead mis à jour:', existingLead.id, 'Step:', data.current_step)
    } else {
      // INSERT nouveau lead
      console.log('➕ INSERT nouveau lead')
      
      // ⭐ NOUVEAU: Par défaut, si pas précisé, lead vient du formulaire direct
      if (leadData.optin_completed === undefined) {
        leadData.optin_completed = false
        leadData.optin_source = 'direct_form'
      }
      
      const { data: newLead, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single()

      if (error) {
        console.error('❌ Erreur INSERT Supabase:', error)
        console.error('Détails erreur:', JSON.stringify(error, null, 2))
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      result = newLead
      console.log('✅ Lead créé:', newLead.id, 'Step:', data.current_step)
    }

    console.log('📤 Réponse API:', {
      success: true,
      leadId: result.id,
      qualified: result.qualified,
      lead_score: result.lead_score,
      optin_completed: result.optin_completed
    })

    return NextResponse.json({
      success: true,
      leadId: result.id,
      qualified: result.qualified,
      lead_score: result.lead_score,
      disqualification_reason: result.disqualification_reason,
      // ⭐ NOUVEAU: Retour infos système unifié
      optin_completed: result.optin_completed,
      form_completed: result.form_completed
    })

  } catch (error) {
    console.error('❌ Erreur API (catch):', error)
    return NextResponse.json({ 
      error: 'Erreur serveur',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}