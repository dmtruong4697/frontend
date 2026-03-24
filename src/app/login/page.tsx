'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@/services/api';
import FloatingDots from '@/components/login/FloatingDots';
import appLogo from '@/assets/logos/app-logo.png';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const response = await api.post('/auth/google', { 
            access_token: tokenResponse.access_token 
        });
        if (response.data?.token) {
          setAuth(response.data.token, response.data.user);
          router.push('/home');
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to authenticate with backend.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError('Google login failed. Please try again.'),
  });

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-warm-50 font-sans">
      {/* Unified Background Layer */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-raelo-50/90 via-warm-100/60 to-blush-100/40"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_var(--color-raelo-100)_0%,_transparent_60%)] opacity-40 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_var(--color-blush-100)_0%,_transparent_60%)] opacity-30 blur-3xl" />
        
        {/* Floating Dots animation */}
        <FloatingDots />
        
        {/* Texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full flex flex-col md:flex-row items-center md:items-stretch min-h-screen pt-12 md:pt-0">
        
        {/* Left Side: Visual Anchor (Centered in its half) */}
        <section className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 md:p-12 animate-fade-in order-2 md:order-1">
          <div className="flex flex-col items-center text-center space-y-10 group/logo">
            <div className="relative w-48 h-48 md:w-80 md:h-80 transition-transform duration-700 hover:scale-105">
                <Image 
                    src={appLogo} 
                    alt="Raelo Logo" 
                    fill
                    sizes="(max-width: 768px) 192px, 320px"
                    className="object-contain drop-shadow-[0_24px_50px_rgba(124,110,240,0.18)]"
                    priority
                />
            </div>
            <div className="space-y-4 opacity-0 animate-fade-in-up [animation-delay:400ms]">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-raelo-600 drop-shadow-sm">
                    Raelo ✦
                </h2>
                <div className="flex items-center justify-center gap-3">
                    <span className="h-px w-8 bg-raelo-300" />
                    <p className="text-raelo-500/80 font-bold tracking-[0.2em] uppercase text-[10px] md:text-sm">
                        Connect • Discover • Chat
                    </p>
                    <span className="h-px w-8 bg-raelo-300" />
                </div>
            </div>
          </div>
        </section>

        {/* Right Side: Login Card (Centered in its half) */}
        <section className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 order-1 md:order-2">
          <div className="w-full max-w-[460px] opacity-0 animate-fade-in-up [animation-delay:600ms]">
            <div 
                className="group relative bg-white/45 backdrop-blur-3xl border border-white/70 rounded-[48px] p-10 md:p-16 shadow-[0_40px_80px_-24px_rgba(124,110,240,0.12),0_20px_40px_-12px_rgba(0,0,0,0.02)] transition-all duration-700 hover:shadow-[0_60px_100px_-30px_rgba(124,110,240,0.18)]"
            >
                {/* Headline & Subtext */}
                <div className="space-y-6 mb-14">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.92] text-warm-900 opacity-0 animate-fade-in-up [animation-delay:1000ms]">
                        Every stranger <br />
                        has a story.
                    </h1>
                    <p className="text-warm-700/70 font-medium text-lg md:text-2xl opacity-0 animate-fade-in-up [animation-delay:1150ms]">
                        Start a conversation that matters.
                    </p>
                </div>

                {/* Login Section */}
                <div className="space-y-10 opacity-0 animate-fade-in-up [animation-delay:1300ms]">
                    <div className="w-full flex justify-center">
                        <button
                            onClick={() => login()}
                            disabled={isLoading}
                            className="group/btn relative w-full flex items-center justify-center gap-4 bg-white hover:bg-warm-50 text-[#1E1C2E] font-black py-4.5 px-8 rounded-full border border-warm-200 shadow-sm transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-1.5">
                                    {[0, 1, 2].map(i => (
                                        <div key={i} className="w-2 h-2 rounded-full bg-raelo-500 animate-bounce" style={{ animationDelay: `${i * 0.12}s` }} />
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    <span className="text-base md:text-lg">Continue with Google</span>
                                </>
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="p-5 bg-error-100/90 backdrop-blur-md border border-error-500/20 text-error-600 rounded-[28px] text-[13px] font-bold text-center animate-shake">
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer Text */}
                <div className="mt-14 pt-10 border-t border-raelo-500/10 opacity-0 animate-fade-in-up [animation-delay:1450ms]">
                    <p className="text-[12px] font-medium text-warm-700/40 leading-relaxed text-center">
                        By continuing, you agree to our <br className="md:hidden" />
                        <a href="#" className="text-raelo-400 hover:underline">Terms of Service</a> and <a href="#" className="text-raelo-400 hover:underline">Privacy Policy</a>.
                    </p>
                </div>

                {/* Subtle card hover glow */}
                <div className="absolute inset-0 -z-10 rounded-[48px] bg-raelo-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
