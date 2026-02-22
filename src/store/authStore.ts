// ============================================================
// authStore.ts — STUB (auth removed)
// This store has been deprecated. The application now operates
// in anonymous mode. This file is kept temporarily to prevent
// import errors in any files that haven't been updated yet.
// ============================================================

export const useAuthStore = () => ({
  user: null,
  isAuthenticated: false,
  signOut: () => {},
  signIn: () => {},
});
