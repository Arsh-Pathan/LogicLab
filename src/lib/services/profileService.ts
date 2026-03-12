import { supabase, supabaseConfigured } from '../supabase';
import type { UserProfile } from '../../types/circuit';

export async function getProfile(userId: string): Promise<UserProfile | null> {
  if (!supabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    // Also get email from auth user
    const { data: authData } = await supabase.auth.getUser();
    const email = authData.user?.email ?? '';

    return {
      ...data,
      email,
    } as UserProfile;
  } catch (err) {
    console.error('Failed to fetch profile:', err);
    return null;
  }
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<UserProfile, 'display_name' | 'avatar_url' | 'bio' | 'website'>>
): Promise<UserProfile | null> {
  if (!supabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    const { data: authData } = await supabase.auth.getUser();
    const email = authData.user?.email ?? '';

    return {
      ...data,
      email,
    } as UserProfile;
  } catch (err) {
    console.error('Failed to update profile:', err);
    return null;
  }
}
