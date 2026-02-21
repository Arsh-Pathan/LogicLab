import { useState } from 'react';
import { X, Github, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useUIStore } from '../../../store/uiStore';
import { useAuthStore } from '../../../store/authStore';
import { supabaseConfigured } from '../../../lib/supabase';

export default function AuthModal() {
  const showAuthModal = useUIStore((s) => s.showAuthModal);
  const setShowAuthModal = useUIStore((s) => s.setShowAuthModal);
  
  const { signInWithGoogle, signInWithGithub, signInWithEmail, signUpWithEmail, loading } = useAuthStore();
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!showAuthModal) return null;

  const handleEmailAuth = async () => {
    setError(null);
    if (!email || !password) {
      setError('Required fields missing.');
      return;
    }
    
    const result = mode === 'signin' 
      ? await signInWithEmail(email, password)
      : await signUpWithEmail(email, password);
    
    if (result.error) {
      setError(result.error);
    } else {
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/20 backdrop-blur-xl p-4">
      <div className="relative w-full max-w-lg animate-in fade-in zoom-in-95 duration-500">
        <div className="relative bg-app border border-border-strong rounded-[2.5rem] shadow-2xl overflow-hidden p-12">
          {/* Close */}
          <button
            onClick={() => setShowAuthModal(false)}
            className="absolute top-8 right-8 text-dim hover:text-main transition-colors p-2"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 text-accent font-bold text-[10px] uppercase tracking-widest">
              Institutional Access
            </div>
            <h2 className="text-4xl font-bold tracking-tight">
              {mode === 'signin' ? 'Welcome Back.' : 'Initialize Account.'}
            </h2>
            <p className="text-lg text-dim font-medium leading-relaxed">
              Authenticate to sync experiment data and laboratory state.
            </p>
          </div>

          {!supabaseConfigured ? (
            <div className="bg-accent/5 border border-accent/10 rounded-2xl p-6 text-center">
              <p className="text-accent text-sm font-bold mb-2">Cloud systems offline.</p>
              <p className="text-dim text-xs font-medium">Please configure institutional credentials to proceed.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* OAuth Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={signInWithGoogle}
                  disabled={loading}
                  className="flex items-center justify-center gap-3 h-14 rounded-2xl bg-sidebar border border-border-main text-sm font-bold hover:bg-app transition-all disabled:opacity-50"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google SSO
                </button>
                <button
                  onClick={signInWithGithub}
                  disabled={loading}
                  className="flex items-center justify-center gap-3 h-14 rounded-2xl bg-sidebar border border-border-main text-sm font-bold hover:bg-app transition-all disabled:opacity-50"
                >
                  <Github size={18} />
                  GitHub Access
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-border-main" />
                <span className="text-[10px] font-black text-muted uppercase tracking-[0.2em]">OR SECURE EMAIL</span>
                <div className="flex-1 h-px bg-border-main" />
              </div>

              {/* Form */}
              <div className="space-y-4">
                {error && <p className="text-accent text-[11px] font-bold text-center tracking-tight">{error}</p>}
                
                <div className="space-y-3">
                  <div className="relative group">
                    <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Institutional Email"
                      className="w-full h-14 bg-sidebar border border-border-main rounded-2xl pl-14 pr-4 text-sm font-semibold outline-none focus:border-accent transition-all placeholder:text-muted"
                    />
                  </div>
                  <div className="relative group">
                    <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-accent transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Access Cipher"
                      className="w-full h-14 bg-sidebar border border-border-main rounded-2xl pl-14 pr-14 text-sm font-semibold outline-none focus:border-accent transition-all placeholder:text-muted"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-muted hover:text-main transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleEmailAuth}
                  disabled={loading || !email || !password}
                  className="w-full h-14 rounded-2xl bg-main text-app font-bold text-sm hover:opacity-90 transition-all disabled:opacity-40 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : (mode === 'signin' ? 'Proceed to Labs' : 'Initialize Terminal')}
                </button>
              </div>

              <p className="text-center text-xs font-bold text-dim pt-4">
                {mode === 'signin' ? "Lacking an account?" : "Already initialized?"}{' '}
                <button
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="text-accent underline underline-offset-4 decoration-accent/30 hover:decoration-accent transition-all"
                >
                  {mode === 'signin' ? 'Join Institution' : 'Signin'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

