import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    console.log('📥 Lead reçu:', data.email)

    const leadData = {
      email: data.email,
      secteur: data.secteur || null,
      secteur_autre: data.secteur_autre || null,
      chiffre_affaires: data.chiffre_affaires || null,
      nombre_employes: data.nombre_employes || null,
      intensite_probleme: data.intensite_probleme || null,
      qualified: data.qualified || false
    }

    console.log('💾 Données:', leadData)

    // Vérifier si lead existe
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', data.email)
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
        console.error('❌ Erreur UPDATE:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      result = updated
      console.log('✅ Lead mis à jour:', existingLead.id)
    } else {
      // Insert
      const { data: created, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single()

      if (error) {
        console.error('❌ Erreur INSERT:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      result = created
      console.log('✅ Lead créé:', created.id)
    }

    return NextResponse.json({
      success: true,
      leadId: result.id
    })

  } catch (error) {
    console.error('❌ Erreur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
