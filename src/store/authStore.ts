import { create } from 'zustand';
import { supabase, supabaseConfigured } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { UserProfile, AuthView } from '../types/circuit';
import * as authServiceModule from '../lib/services/authService';
import { getProfile } from '../lib/services/profileService';
import { getLocalStorageStats } from '../lib/services/migrationService';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  showAuthModal: boolean;
  authView: AuthView;
  showMigrationPrompt: boolean;

  initialize: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOut: () => Promise<void>;
  setSession: (session: Session | null) => void;
  fetchProfile: () => Promise<void>;
  clearError: () => void;
  setShowAuthModal: (show: boolean) => void;
  setAuthView: (view: AuthView) => void;
  setShowMigrationPrompt: (show: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  showAuthModal: false,
  authView: 'login',
  showMigrationPrompt: false,

  initialize: async () => {
    if (!supabaseConfigured || !supabase) {
      set({ isLoading: false });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({
        session,
        user: session?.user ?? null,
        isAuthenticated: !!session?.user,
        isLoading: false,
      });

      if (session?.user) {
        get().fetchProfile();
      }

      supabase.auth.onAuthStateChange((event, session) => {
        set({
          session,
          user: session?.user ?? null,
          isAuthenticated: !!session?.user,
        });

        if (event === 'SIGNED_IN' && session?.user) {
          get().fetchProfile();
          // Check for local data to migrate
          const stats = getLocalStorageStats();
          if (stats.hasData) {
            set({ showMigrationPrompt: true });
          }
        }

        if (event === 'SIGNED_OUT') {
          set({ profile: null, showMigrationPrompt: false });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({ isLoading: false });
    }
  },

  signInWithEmail: async (email, password) => {
    set({ error: null, isLoading: true });
    try {
      await authServiceModule.signInWithEmail(email, password);
      set({ showAuthModal: false, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to sign in', isLoading: false });
    }
  },

  signUpWithEmail: async (email, password, displayName) => {
    set({ error: null, isLoading: true });
    try {
      await authServiceModule.signUpWithEmail(email, password, displayName);
      set({ showAuthModal: false, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to sign up', isLoading: false });
    }
  },

  resetPassword: async (email) => {
    set({ error: null, isLoading: true });
    try {
      await authServiceModule.resetPassword(email);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to send reset email', isLoading: false });
    }
  },

  signInWithGoogle: async () => {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      set({ error: err.message || 'Google sign-in failed' });
    }
  },

  signInWithGithub: async () => {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      set({ error: err.message || 'GitHub sign-in failed' });
    }
  },

  signOut: async () => {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null, isAuthenticated: false, profile: null });
    } catch (err: any) {
      set({ error: err.message || 'Sign-out failed' });
    }
  },

  setSession: (session) => {
    set({
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session?.user,
    });
  },

  fetchProfile: async () => {
    const user = get().user;
    if (!user) return;

    const profile = await getProfile(user.id);
    if (profile) {
      set({ profile });
    }
  },

  clearError: () => set({ error: null }),
  setShowAuthModal: (show) => set({ showAuthModal: show, error: null }),
  setAuthView: (view) => set({ authView: view, error: null }),
  setShowMigrationPrompt: (show) => set({ showMigrationPrompt: show }),
}));
