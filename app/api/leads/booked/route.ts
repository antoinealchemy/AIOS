import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { session_id } = await request.json()

    if (!session_id) {
      return NextResponse.json({ error: 'session_id manquant' }, { status: 400 })
    }

    const { error } = await supabase
      .from('leads')
      .update({ call_booked: true })
      .eq('session_id', session_id)

    if (error) {
      console.error('Erreur update call_booked:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('✅ call_booked = true pour session:', session_id)
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erreur API booked:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
