import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Get user profile and organization details directly
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select(`
        *,
        organizations!profiles_organization_id_fkey (
          id,
          name
        )
      `)
      .eq('email', email)
      .single()

    if (profileError || !profile) {
      // Still send success response for security
      return NextResponse.json(
        { message: 'If an account with that email exists, we\'ve sent a password reset link.' },
        { status: 200 }
      )
    }

    const organization = (profile as any).organizations

    // Generate password reset token
    const resetToken = crypto.randomUUID()
    
    // Store reset token in database (you might want to create a separate table for this)
    // For now, we'll use Supabase's built-in password reset
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`

    // Send password reset email using Supabase's built-in functionality
    const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: resetUrl
      }
    })

    if (resetError) {
      console.error('Password reset error:', resetError)
      return NextResponse.json(
        { message: 'If an account with that email exists, we\'ve sent a password reset link.' },
        { status: 200 }
      )
    }

    // Optional: Send custom email via n8n workflow
    try {
      const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
      if (n8nWebhookUrl) {
        await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'password_reset',
            to: email,
            metadata: {
              userName: (profile as any).full_name || 'User',
              organizationName: organization?.name || 'Henly AI',
              resetUrl: resetUrl,
              expiresAt: new Date(Date.now() + 60 * 60 * 1000).toLocaleDateString() // 1 hour from now
            }
          })
        })
      }
    } catch (emailError) {
      console.error('Failed to send custom email:', emailError)
      // Don't fail the request if custom email fails
    }

    return NextResponse.json(
      { message: 'If an account with that email exists, we\'ve sent a password reset link.' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
