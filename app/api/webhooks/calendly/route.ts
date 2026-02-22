import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()

    // Calendly envoie event "invitee.created" quand quelqu'un réserve
    if (payload.event !== 'invitee.created') {
      return NextResponse.json({ received: true })
    }

    const invitee = payload.payload?.invitee || payload.payload
    const email = invitee?.email
    const name = invitee?.name

    // Récupérer session_id depuis utm_content
    const trackingParams = payload.payload?.tracking || {}
    const sessionId = trackingParams.utm_content

    console.log('📅 Calendly webhook:', { email, name, sessionId })

    if (!sessionId) {
      console.log('⚠️ Pas de session_id, impossible de lier')
      return NextResponse.json({ received: true, linked: false })
    }

    // Mettre à jour le lead avec email et nom
    const { error } = await supabase
      .from('leads')
      .update({ email, name })
      .eq('session_id', sessionId)

    if (error) {
      console.error('❌ Erreur update:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('✅ Lead mis à jour avec email:', email)

    return NextResponse.json({ success: true, linked: true })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json({ error: 'Erreur webhook' }, { status: 500 })
  }
}
