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
    const isQualifiedActivity = 
      data.activity === 'Cabinet de conseil' || 
      data.activity === 'Cabinet d\'experts-comptables' || 
      data.activity === 'Cabinet d\'avocats'
    
    const isQualifiedRevenue = 
      data.revenue === '200-500K€' || 
      data.revenue === '500K-1M€' || 
      data.revenue === '1M€+'

    const isQualified = isQualifiedActivity && isQualifiedRevenue

    // PRÉPARER DONNÉES COMPLÈTES
    const leadData = {
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      activity: data.activity === 'Autre' ? data.activityOther : data.activity,
      team_size: data.teamSize,
      revenue: data.revenue,
      qualified: isQualified,
      completed: true,
      call_booked: false,
      pixel_sent: false
    }

    let leadId = data.leadId
    let insertedLead

    if (leadId) {
      // UPDATE si lead existe déjà (sauvegarde partielle)
      const { data: updatedLead, error } = await supabase
        .from('leads')
        .update(leadData)
        .eq('id', leadId)
        .select()
        .single()

      if (error) {
        console.error('Erreur UPDATE Supabase:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      insertedLead = updatedLead
      console.log('✅ Lead complété (UPDATE):', leadId)
    } else {
      // INSERT nouveau lead complet (rare, si sauvegarde partielle n'a pas fonctionné)
      const { data: newLead, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single()

      if (error) {
        console.error('Erreur INSERT Supabase:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      insertedLead = newLead
      console.log('✅ Lead créé (INSERT):', insertedLead.id)
    }

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