import { useState, useEffect, useRef } from 'react';
import { X, Github, Mail, Eye, EyeOff, Loader2, ShieldAlert, Key, Globe, Database, Activity, Cpu } from 'lucide-react';
import { gsap } from 'gsap';
import { useUIStore } from '../../../store/uiStore';
import { useAuthStore } from '../../../store/authStore';
import { supabaseConfigured } from '../../../lib/supabase';
import Logo from '../../../components/common/Logo';

export default function AuthModal() {
  const showAuthModal = useUIStore((s) => s.showAuthModal);
  const setShowAuthModal = useUIStore((s) => s.setShowAuthModal);
  const modalRef = useRef<HTMLDivElement>(null);
  
  const { signInWithGoogle, signInWithGithub, signInWithEmail, signUpWithEmail, loading } = useAuthStore();
  
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (showAuthModal) {
      gsap.fromTo(modalRef.current, 
        { scale: 0.9, opacity: 0, filter: 'blur(20px)' },
        { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out' }
      );
    }
  }, [showAuthModal]);

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
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-app/80 backdrop-blur-3xl overflow-y-auto">
      
      {/* Background Decor - Lattice Wires */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <svg width="100%" height="100%">
          <pattern id="auth-grid" width="100" height="100" patternUnits="userSpaceOnUse">
             <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#auth-grid)" />
        </svg>
      </div>

      <div 
        ref={modalRef}
        className="relative w-full max-w-2xl bg-panel border border-border-strong rounded-sm shadow-float overflow-hidden flex flex-col md:flex-row gap-0"
      >
        {/* SIDE BAR: INSTITUTIONAL STATS */}
        <div className="hidden md:flex w-72 bg-main text-app p-10 flex-col justify-between relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--color-app)_1px,_transparent_1px)] bg-[size:20px_20px]" />
           
           <div className="space-y-10 relative z-10">
              <Logo size={40} className="invert" />
              <div className="space-y-4">
                 <h3 className="text-2xl font-black italic tracking-tightest uppercase leading-none">Security <br />Port.</h3>
                 <p className="text-[9px] font-black uppercase tracking-widest opacity-40 leading-relaxed italic">
                    All identity traces are encrypted and synchronized across the institutional logic lattice.
                 </p>
              </div>
           </div>

           <div className="space-y-8 relative z-10">
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest opacity-30">
                    <span>Lattice Load</span>
                    <span>Verified</span>
                 </div>
                 <div className="h-[1px] w-full bg-app/20 relative">
                    <div className="absolute left-0 top-0 h-full w-[65%] bg-app animate-shimmer" />
                 </div>
              </div>
              <div className="flex gap-4">
                 <Activity size={16} strokeWidth={1} className="opacity-40" />
                 <ShieldAlert size={16} strokeWidth={1} className="opacity-40" />
                 <Cpu size={16} strokeWidth={1} className="opacity-40" />
              </div>
           </div>
        </div>

        {/* MAIN TERMINAL: INPUTS */}
        <div className="flex-1 p-12 md:p-16 space-y-12 bg-app relative mt-16 md:mt-0">
          
          {/* Institutional Exit (Mobile and Desktop) */}
          <button
            onClick={() => setShowAuthModal(false)}
            className="absolute top-8 right-8 text-dim hover:text-main transition-all p-2 rounded-sm border border-border-main hover:bg-neutral-50"
          >
            <X size={18} />
          </button>

          <header className="space-y-6">
            <div className="flex items-center gap-4 text-accent-blue opacity-50">
               <Globe size={14} className="animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-[0.6em] italic">Access Port: V12.4</span>
            </div>
            <h2 className="text-5xl font-black tracking-tighter uppercase leading-[0.85] italic">
              {mode === 'signin' ? 'Verify <br />Identity.' : 'Registry <br />Enrollment.'}
            </h2>
            <p className="text-sm font-medium text-dim uppercase tracking-[0.1em] italic opacity-60">
               Establish a persistent link to the global logic registry.
            </p>
          </header>

          {!supabaseConfigured ? (
             <div className="hardware-card p-10 text-center space-y-6 bg-red-500/5 border-red-500/20">
                <Database className="w-10 h-10 mx-auto text-red-500 opacity-20" />
                <div className="space-y-2">
                   <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">Network Offline</p>
                   <p className="text-dim text-[9px] font-medium italic">Environmental variables missing for cloud sync.</p>
                </div>
             </div>
          ) : (
            <div className="space-y-12">
              {/* SSO GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={signInWithGoogle}
                  disabled={loading}
                  className="flex items-center justify-center gap-4 h-14 border border-border-main rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-50 transition-all disabled:opacity-50 group"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="grayscale opacity-40 group-hover:opacity-100 transition-all">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="currentColor"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor"/>
                  </svg>
                  G-SSO Port
                </button>
                <button
                  onClick={signInWithGithub}
                  disabled={loading}
                  className="flex items-center justify-center gap-4 h-14 border border-border-main rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-neutral-50 transition-all disabled:opacity-50 group"
                >
                  <Github size={18} className="opacity-40 group-hover:opacity-100 transition-all" />
                  GitHub Sync
                </button>
              </div>

              {/* DIVIDER */}
              <div className="flex items-center gap-6">
                <div className="flex-1 h-px bg-border-main opacity-20" />
                <span className="text-[8px] font-black text-dim uppercase tracking-[0.4em] opacity-40 italic">or encrypted cipher</span>
                <div className="flex-1 h-px bg-border-main opacity-20" />
              </div>

              {/* INPUT MATRIX */}
              <div className="space-y-6">
                {error && (
                   <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-500/20 rounded-sm">
                      <ShieldAlert size={14} className="text-red-500" />
                      <p className="text-red-600 text-[10px] font-black uppercase tracking-widest italic">{error}</p>
                   </div>
                )}
                
                <div className="space-y-4">
                  <div className="relative group">
                    <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-dim opacity-30 group-focus-within:opacity-100 transition-opacity" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Access Email..."
                      className="premium-input pl-16 py-6 text-xl"
                    />
                  </div>
                  <div className="relative group">
                    <Key size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-dim opacity-30 group-focus-within:opacity-100 transition-opacity" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Access Cipher..."
                      className="premium-input pl-16 pr-16 py-6 text-xl"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-dim hover:text-main transition-all"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleEmailAuth}
                  disabled={loading || !email || !password}
                  className="btn-premium w-full py-8 text-xs relative group overflow-hidden"
                >
                   <span className="relative z-10 flex items-center justify-center gap-6">
                     {loading ? <Loader2 size={18} className="animate-spin opacity-40" /> : (mode === 'signin' ? 'AUTHORIZE HANDSHAKE' : 'INITIALIZE ENROLLMENT')}
                   </span>
                   <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
              </div>

              {/* FOOTER TOGGLE */}
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-dim opacity-40 italic">
                  {mode === 'signin' ? "Not in the Registry?" : "Access state existing?"}{' '}
                  <button
                    onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                    className="text-main underline underline-offset-8 decoration-border-main hover:decoration-main transition-all ml-2"
                  >
                    {mode === 'signin' ? 'Enlist Identity' : 'Sync Protocol'}
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
