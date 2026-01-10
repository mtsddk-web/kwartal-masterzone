import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE() {
  try {
    const cookieStore = await cookies();

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    // Create client to get current user
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore - this is called from server component
          }
        },
      },
    });

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete user's data first
    const { error: dataError } = await supabase
      .from('quarterly_plans')
      .delete()
      .eq('user_id', user.id);

    if (dataError) {
      console.error('Error deleting user data:', dataError);
      // Continue anyway - we still want to delete the user
    }

    // Delete plan versions (get plan IDs first)
    const { data: plans } = await supabase
      .from('quarterly_plans')
      .select('id')
      .eq('user_id', user.id);

    if (plans && plans.length > 0) {
      const planIds = plans.map(p => p.id);
      await supabase
        .from('plan_versions')
        .delete()
        .in('plan_id', planIds);
    }

    // If we have service role key, delete the user completely
    if (supabaseServiceRoleKey) {
      const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      const { error: deleteError } = await adminClient.auth.admin.deleteUser(
        user.id
      );

      if (deleteError) {
        console.error('Error deleting user:', deleteError);
        return NextResponse.json(
          { error: 'Failed to delete account' },
          { status: 500 }
        );
      }
    } else {
      // Without service role key, we can only sign out and mark for deletion
      // The user would need to be deleted manually or via Supabase Dashboard
      console.warn('SUPABASE_SERVICE_ROLE_KEY not set - user account not fully deleted');
    }

    // Sign out
    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in delete-account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
