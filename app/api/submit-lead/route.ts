import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // LOGIQUE DE QUALIFICATION
    const isQualified = 
      data.interested === 'Oui, je suis intéressé et je cherche une solution' &&
      data.role !== 'Manager/Employé (je ne suis pas décisionnaire)' &&
      data.budget !== 'Moins de 1 500€' &&
      data.urgency !== 'Non, je réfléchis encore / pas d\'urgence'

    // PRÉPARER DONNÉES POUR SUPABASE
    const leadData = {
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      interested: data.interested === 'Oui, je suis intéressé et je cherche une solution',
      role: data.role === 'Autre' ? data.roleOther : data.role,
      business_description: data.businessDescription || null,
      tools_used: data.toolsUsed,
      problems: data.problems.includes('Autre') 
        ? [...data.problems.filter((p: string) => p !== 'Autre'), data.problemsOther]
        : data.problems,
      budget: data.budget,
      urgency: data.urgency,
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