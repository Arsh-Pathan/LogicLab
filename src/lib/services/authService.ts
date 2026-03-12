import { supabase, supabaseConfigured } from '../supabase';

export async function signInWithEmail(email: string, password: string) {
  if (!supabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string
) {
  if (!supabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function resetPassword(email: string) {
  if (!supabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured');
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/home`,
  });

  if (error) throw error;
}

export async function updatePassword(newPassword: string) {
  if (!supabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured');
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) throw error;
}

export function onAuthStateChange(
  callback: (event: string, session: any) => void
) {
  if (!supabaseConfigured || !supabase) return { data: { subscription: null } };
  return supabase.auth.onAuthStateChange(callback);
}
