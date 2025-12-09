import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // PRÉPARER DONNÉES PARTIELLES (certains champs peuvent être vides)
    const leadData = {
      first_name: data.firstName || null,
      last_name: data.lastName || null,
      email: data.email || null,
      phone: data.phone || null,
      activity: data.activity === 'Autre' ? data.activityOther : (data.activity || null),
      team_size: data.teamSize || null,
      revenue: data.revenue || null,
      current_step: data.currentStep,
      completed: false,
      qualified: false // Par défaut false pour leads partiels
    }

    let leadId = data.leadId

    if (leadId) {
      // UPDATE si lead existe déjà
      const { error } = await supabase
        .from('leads')
        .update(leadData)
        .eq('id', leadId)

      if (error) {
        console.error('Erreur UPDATE Supabase:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      console.log('✅ Lead mis à jour:', leadId)
    } else {
      // INSERT nouveau lead partiel
      const { data: insertedLead, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single()

      if (error) {
        console.error('Erreur INSERT Supabase:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      leadId = insertedLead.id
      console.log('✅ Lead partiel créé:', leadId)
    }

    return NextResponse.json({
      success: true,
      leadId: leadId
    })

  } catch (error) {
    console.error('Erreur API:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}