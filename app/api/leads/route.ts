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
      completed: data.completed,
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
      leadData.douleur_score = data.douleur_score
    }
    if (data.budget) {
      leadData.budget = data.budget
    }
    if (data.urgence) {
      leadData.urgence = data.urgence
    }

    console.log('💾 Données à sauvegarder:', leadData)

    // VÉRIFIER SI LEAD EXISTE DÉJÀ (par email)
    const { data: existingLead, error: selectError } = await supabase
      .from('leads')
      .select('id')
      .eq('email', data.email)
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('❌ Erreur SELECT:', selectError)
    }

    let result

    if (existingLead) {
      // UPDATE lead existant
      console.log('🔄 UPDATE lead existant:', existingLead.id)
      
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
      lead_score: result.lead_score
    })

    return NextResponse.json({
      success: true,
      leadId: result.id,
      qualified: result.qualified,
      lead_score: result.lead_score,
      disqualification_reason: result.disqualification_reason
    })

  } catch (error) {
    console.error('❌ Erreur API (catch):', error)
    return NextResponse.json({ 
      error: 'Erreur serveur',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}