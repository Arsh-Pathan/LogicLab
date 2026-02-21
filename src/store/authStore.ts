// ============================================================
// Auth Store — Supabase Authentication with OAuth Providers
// ============================================================

import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import supabase, { supabaseConfigured } from '../lib/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;

  // Derived
  isAuthenticated: boolean;

  // Actions
  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  initialized: false,
  isAuthenticated: false,

  initialize: async () => {
    if (!supabaseConfigured || !supabase) {
      set({ loading: false, initialized: true });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();

      set({
        user: session?.user ?? null,
        session: session ?? null,
        isAuthenticated: !!session?.user,
        loading: false,
        initialized: true,
      });

      // Listen for auth state changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          user: session?.user ?? null,
          session: session ?? null,
          isAuthenticated: !!session?.user,
        });
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ loading: false, initialized: true });
    }
  },

  signInWithGoogle: async () => {
    if (!supabase) return;
    set({ loading: true });

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) {
        console.error('Google sign-in error:', error.message);
      }
    } catch (err) {
      console.error('Google sign-in failed:', err);
    } finally {
      set({ loading: false });
    }
  },

  signInWithGithub: async () => {
    if (!supabase) return;
    set({ loading: true });

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) {
        console.error('GitHub sign-in error:', error.message);
      }
    } catch (err) {
      console.error('GitHub sign-in failed:', err);
    } finally {
      set({ loading: false });
    }
  },

  signInWithEmail: async (email: string, password: string) => {
    if (!supabase) return { error: 'Supabase not configured' };
    set({ loading: true });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ loading: false });
        return { error: error.message };
      }

      set({
        user: data.user,
        session: data.session,
        isAuthenticated: !!data.user,
        loading: false,
      });

      return { error: null };
    } catch (err) {
      set({ loading: false });
      return { error: 'An unexpected error occurred' };
    }
  },

  signUpWithEmail: async (email: string, password: string) => {
    if (!supabase) return { error: 'Supabase not configured' };
    set({ loading: true });

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        set({ loading: false });
        return { error: error.message };
      }

      set({
        user: data.user,
        session: data.session,
        isAuthenticated: !!data.user,
        loading: false,
      });

      return { error: null };
    } catch (err) {
      set({ loading: false });
      return { error: 'An unexpected error occurred' };
    }
  },

  signOut: async () => {
    if (!supabase) return;
    set({ loading: true });

    try {
      await supabase.auth.signOut();
      set({
        user: null,
        session: null,
        isAuthenticated: false,
        loading: false,
      });
    } catch (err) {
      console.error('Sign out error:', err);
      set({ loading: false });
    }
  },
}));
