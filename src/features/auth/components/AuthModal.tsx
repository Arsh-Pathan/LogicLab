import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Github, ArrowLeft, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

export default function AuthModal() {
  const {
    showAuthModal,
    setShowAuthModal,
    authView,
    setAuthView,
    error,
    clearError,
    isLoading,
    signInWithEmail,
    signUpWithEmail,
    resetPassword,
    signInWithGoogle,
    signInWithGithub,
  } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!showAuthModal) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await signInWithEmail(email, password);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (password !== confirmPassword) {
      return; // store error handled locally below
    }
    if (password.length < 6) {
      return;
    }
    await signUpWithEmail(email, password, displayName);
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await resetPassword(email);
    setResetSent(true);
  };

  const switchView = (view: 'login' | 'signup' | 'forgot-password') => {
    setAuthView(view);
    setResetSent(false);
    clearError();
  };

  const passwordStrength = (() => {
    if (password.length === 0) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 4);
  })();

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];

  const passwordMismatch = authView === 'signup' && confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-md relative"
        style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}
      >
        {/* Close button */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full transition-colors"
          style={{ color: 'var(--text-dim)' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <X size={18} />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            {authView === 'forgot-password' && (
              <button
                onClick={() => switchView('login')}
                className="absolute top-4 left-4 p-1.5 rounded-full transition-colors"
                style={{ color: 'var(--text-dim)' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--text-main)' }}
            >
              {authView === 'login' && 'Welcome Back'}
              {authView === 'signup' && 'Create Account'}
              {authView === 'forgot-password' && 'Reset Password'}
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
              {authView === 'login' && 'Sign in to sync your circuits to the cloud'}
              {authView === 'signup' && 'Start building and sharing your circuits'}
              {authView === 'forgot-password' && "Enter your email to receive a reset link"}
            </p>
          </div>

          {/* Error display */}
          {error && (
            <div
              className="flex items-center gap-2 p-3 rounded-md mb-4 text-sm"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Login View */}
          {authView === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="input-field pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => switchView('forgot-password')}
                  className="text-xs font-medium transition-colors"
                  style={{ color: 'var(--accent-blue)' }}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full justify-center py-3 text-sm font-semibold"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
              </button>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full" style={{ borderTop: '1px solid var(--border-subtle)' }} />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 text-xs" style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-muted)' }}>
                    or continue with
                  </span>
                </div>
              </div>

              {/* OAuth buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors"
                  style={{
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    backgroundColor: 'var(--bg-app)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--bg-app)')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={signInWithGithub}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors"
                  style={{
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    backgroundColor: 'var(--bg-app)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--bg-app)')}
                >
                  <Github size={18} />
                  GitHub
                </button>
              </div>

              <p className="text-center text-sm pt-2" style={{ color: 'var(--text-dim)' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchView('signup')}
                  className="font-semibold"
                  style={{ color: 'var(--accent-blue)' }}
                >
                  Sign up
                </button>
              </p>
            </form>
          )}

          {/* Signup View */}
          {authView === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                  Display Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Your display name"
                    required
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    required
                    minLength={6}
                    className="input-field pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 flex gap-1">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className="h-1 flex-1 rounded-full transition-colors"
                          style={{
                            backgroundColor: i <= passwordStrength ? strengthColors[passwordStrength] : 'var(--border-subtle)',
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium" style={{ color: strengthColors[passwordStrength] }}>
                      {strengthLabels[passwordStrength]}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="input-field pl-10"
                    style={passwordMismatch ? { borderColor: '#ef4444' } : {}}
                  />
                </div>
                {passwordMismatch && (
                  <p className="text-xs mt-1" style={{ color: '#ef4444' }}>
                    Passwords don't match
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || passwordMismatch || password.length < 6}
                className="btn-primary w-full justify-center py-3 text-sm font-semibold"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
              </button>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full" style={{ borderTop: '1px solid var(--border-subtle)' }} />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 text-xs" style={{ backgroundColor: 'var(--bg-app)', color: 'var(--text-muted)' }}>
                    or continue with
                  </span>
                </div>
              </div>

              {/* OAuth buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors"
                  style={{
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    backgroundColor: 'var(--bg-app)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--bg-app)')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  onClick={signInWithGithub}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors"
                  style={{
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    backgroundColor: 'var(--bg-app)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--bg-app)')}
                >
                  <Github size={18} />
                  GitHub
                </button>
              </div>

              <p className="text-center text-sm pt-2" style={{ color: 'var(--text-dim)' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchView('login')}
                  className="font-semibold"
                  style={{ color: 'var(--accent-blue)' }}
                >
                  Sign in
                </button>
              </p>
            </form>
          )}

          {/* Forgot Password View */}
          {authView === 'forgot-password' && (
            <form onSubmit={handleReset} className="space-y-4">
              {resetSent ? (
                <div className="text-center py-6 space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                    <CheckCircle size={24} style={{ color: '#22c55e' }} />
                  </div>
                  <div>
                    <p className="font-semibold mb-1" style={{ color: 'var(--text-main)' }}>
                      Check your email
                    </p>
                    <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
                      We've sent a password reset link to <strong>{email}</strong>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => switchView('login')}
                    className="text-sm font-semibold"
                    style={{ color: 'var(--accent-blue)' }}
                  >
                    Back to login
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        className="input-field pl-10"
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full justify-center py-3 text-sm font-semibold"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Send Reset Link'}
                  </button>

                  <p className="text-center text-sm pt-2" style={{ color: 'var(--text-dim)' }}>
                    Remember your password?{' '}
                    <button
                      type="button"
                      onClick={() => switchView('login')}
                      className="font-semibold"
                      style={{ color: 'var(--accent-blue)' }}
                    >
                      Sign in
                    </button>
                  </p>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
