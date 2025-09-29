import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

export async function GET(request: NextRequest) {
  try {
    // Initialize Supabase admin client
    const supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get user session using cookies
    const { createServerClient } = await import('@supabase/ssr')
    const { cookies } = await import('next/headers')
    
    const cookieStore = await cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      }
    )

    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = session.user
    const userId = user.id

    // Get user's profile to verify admin access and get organization
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('organization_id, role')
      .eq('id', userId)
      .in('role', ['admin', 'super_admin'])
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'You must be an admin to view organization members' },
        { status: 403 }
      )
    }

    const organizationId = (profile as any).organization_id

    // Fetch organization members (profiles) - include both verified and unverified users
    // Unverified users are those who accepted invitations but haven't verified email yet
    const { data: members, error: membersError } = await supabaseAdmin
      .from('profiles')
      .select(`
        id,
        email,
        full_name,
        role,
        is_active,
        created_at,
        last_login,
        is_verified,
        email_verified_at,
        status,
        invitation_status
      `)
      .eq('organization_id', organizationId)
      .in('invitation_status', ['accepted', 'none']) // Include accepted invitations and direct signups
      .order('created_at', { ascending: false })

    if (membersError) {
      console.error('Failed to fetch organization members:', membersError)
      return NextResponse.json(
        { error: 'Failed to fetch organization members' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: members || []
    })

  } catch (error) {
    console.error('Fetch members API error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}
