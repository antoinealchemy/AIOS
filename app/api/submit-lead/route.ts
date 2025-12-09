import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // LOGIQUE QUALIFICATION
    // Qualifié SI : Activité = Cabinet (conseil/expert-comptable/avocat) ET CA >= 200K€
    const isQualifiedActivity = 
      data.activity === 'Cabinet de conseil' || 
      data.activity === 'Cabinet d\'experts-comptables' || 
      data.activity === 'Cabinet d\'avocats'
    
    const isQualifiedRevenue = 
      data.revenue === '200-500K€' || 
      data.revenue === '500K-1M€' || 
      data.revenue === '1M€+'

    const isQualified = isQualifiedActivity && isQualifiedRevenue

    // PRÉPARER DONNÉES POUR SUPABASE
    const leadData = {
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      activity: data.activity === 'Autre' ? data.activityOther : data.activity,
      team_size: data.teamSize,
      revenue: data.revenue,
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