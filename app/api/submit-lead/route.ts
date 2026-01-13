import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // PRÉPARER DONNÉES LEAD
    const leadData = {
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      is_cabinet: data.is_cabinet,
      role: data.role,
      douleur_score: data.douleur_score,
      budget: data.budget,
      urgence: data.urgence,
      current_step: data.current_step,
      completed: data.completed,
      qualified: data.qualified,
      pixel_sent: data.pixel_sent || false
    }

    // VÉRIFIER SI LEAD EXISTE DÉJÀ (par email)
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', data.email)
      .single()

    let result

    if (existingLead) {
      // UPDATE lead existant
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
      console.log('✅ Lead mis à jour:', existingLead.id)
    } else {
      // INSERT nouveau lead
      const { data: newLead, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single()

      if (error) {
        console.error('❌ Erreur INSERT Supabase:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      result = newLead
      console.log('✅ Lead créé:', newLead.id)
    }

    return NextResponse.json({
      success: true,
      leadId: result.id,
      qualified: result.qualified,
      lead_score: result.lead_score,
      disqualification_reason: result.disqualification_reason
    })

  } catch (error) {
    console.error('❌ Erreur API:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}