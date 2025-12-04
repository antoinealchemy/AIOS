import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // TOUS LES LEADS SONT QUALIFIÉS
    // Pas de filtrage - tous vont vers entretien1
    const isQualified = true

    // PRÉPARER DONNÉES POUR SUPABASE
    const leadData = {
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      activity: data.activity === 'Autre' ? data.activityOther : data.activity,
      team_size: data.teamSize,
      website: data.noWebsite ? null : data.website,
      qualified: isQualified,
      call_booked: false,
      pixel_sent: false
    }

    // INSÉRER DANS SUPABASE
    const { data: insertedLead, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single()

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('✅ Lead inséré:', insertedLead)

    // RETOURNER RÉSULTAT
    return NextResponse.json({
      success: true,
      qualified: isQualified,
      leadId: insertedLead.id
    })

  } catch (error) {
    console.error('Erreur API:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}