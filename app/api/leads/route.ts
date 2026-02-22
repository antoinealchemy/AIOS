import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const leadData: any = {
      session_id: data.session_id,
      step: data.step,
      completed: data.completed || false,
      secteur: data.secteur,
      secteur_autre: data.secteur_autre,
      chiffre_affaires: data.chiffre_affaires,
      nombre_employes: data.nombre_employes,
      intensite_probleme: data.intensite_probleme,
      email: data.email || null,
      name: data.name || null,
      phone: data.phone || null
    }

    // Chercher lead existant par session_id
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('session_id', data.session_id)
      .single()

    let result

    if (existingLead) {
      // Update
      const { data: updated, error } = await supabase
        .from('leads')
        .update(leadData)
        .eq('id', existingLead.id)
        .select()
        .single()

      if (error) {
        console.error('❌ UPDATE:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      result = updated
    } else {
      // Insert
      const { data: created, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single()

      if (error) {
        console.error('❌ INSERT:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      result = created
    }

    return NextResponse.json({ success: true, leadId: result.id })

  } catch (error) {
    console.error('❌ Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
