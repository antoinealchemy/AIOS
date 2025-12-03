import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // LOGIQUE DE QUALIFICATION SIMPLIFIEE
    const isQualified = 
      data.interested === 'Oui, je suis intéressé et je cherche une solution' &&
      data.budget !== 'Moins de 1 500€'

    // PREPARER DONNEES POUR SUPABASE
    const leadData = {
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      interested: data.interested === 'Oui, je suis intéressé et je cherche une solution',
      activity: data.activity === 'Autre' ? data.activityOther : data.activity,
      website: data.noWebsite ? null : data.website,
      role: data.role === 'Autre' ? data.roleOther : data.role,
      budget: data.budget,
      qualified: isQualified,
      call_booked: false,
      pixel_sent: false
    }

    // INSERER DANS SUPABASE
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

    // RETOURNER RESULTAT
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