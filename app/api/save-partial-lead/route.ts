import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log('📥 Partial submit - Données reçues:', {
      email: data.email,
      step: data.currentStep
    })

    // PRÉPARER DONNÉES PARTIELLES (email temporaire + step actuel)
    const leadData: any = {
      email: data.email || `partial-${Date.now()}@temp.com`,
      first_name: data.firstName || null,
      last_name: data.lastName || null,
      phone: data.phone || null,
      current_step: data.currentStep || 0,
      completed: false,
      qualified: false, // Par défaut false pour leads partiels
      pixel_sent: false
    }

    // Ajouter champs qualification s'ils existent
    if (data.isCabinet !== null && data.isCabinet !== undefined) {
      leadData.is_cabinet = data.isCabinet === 'oui'
    }
    if (data.role) {
      leadData.role = data.role
    }
    if (data.douleur !== null && data.douleur !== undefined) {
      leadData.douleur_score = data.douleur
    }
    if (data.budget) {
      leadData.budget = data.budget
    }
    if (data.urgence) {
      leadData.urgence = data.urgence
    }

    console.log('💾 Données partielles à sauvegarder:', leadData)

    let leadId = data.leadId

    if (leadId) {
      // UPDATE si lead existe déjà
      console.log('🔄 UPDATE lead partiel:', leadId)
      
      const { error } = await supabase
        .from('leads')
        .update(leadData)
        .eq('id', leadId)

      if (error) {
        console.error('❌ Erreur UPDATE Supabase:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      console.log('✅ Lead partiel mis à jour:', leadId, 'Step:', data.currentStep)
    } else {
      // INSERT nouveau lead partiel
      console.log('➕ INSERT nouveau lead partiel')
      
      const { data: insertedLead, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single()

      if (error) {
        console.error('❌ Erreur INSERT Supabase:', error)
        console.error('Détails erreur:', JSON.stringify(error, null, 2))
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      leadId = insertedLead.id
      console.log('✅ Lead partiel créé:', leadId, 'Step:', data.currentStep)
    }

    return NextResponse.json({
      success: true,
      leadId: leadId
    })

  } catch (error) {
    console.error('❌ Erreur API partial-submit:', error)
    return NextResponse.json({ 
      error: 'Erreur serveur',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}