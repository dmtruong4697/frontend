'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@/services/api';
import Lottie from 'lottie-react';
import funnyDogAnimation from '@/assets/animations/funny-dog.json';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const { credential } = credentialResponse;
      const response = await api.post('/auth/google', { id_token: credential });
      if (response.data?.token) {
        setAuth(response.data.token, response.data.user);
        router.push('/home');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to authenticate with backend.');
    }
  };

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #EEE8FF 0%, #F8F7FF 45%, #FFE8EF 100%)',
        minHeight: '100dvh',
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-[-80px] left-[-80px] w-56 h-56 rounded-full pointer-events-none"
        style={{ background: 'rgba(124,110,240,0.14)', filter: 'blur(48px)' }}
      />
      <div
        className="absolute bottom-[-60px] right-[-60px] w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'rgba(244,143,173,0.16)', filter: 'blur(56px)' }}
      />
      <div
        className="absolute top-1/2 left-[-40px] w-40 h-40 rounded-full pointer-events-none"
        style={{ background: 'rgba(124,110,240,0.10)', filter: 'blur(40px)' }}
      />

      {/* Card */}
      <div
        className="w-full max-w-sm flex flex-col items-center gap-8 relative z-10 animate-fade-in-up"
        style={{
          background: 'rgba(255,255,255,0.90)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2.5rem',
          padding: '2.5rem 2rem',
          boxShadow: '0 8px 48px rgba(124,110,240,0.15), 0 2px 12px rgba(0,0,0,0.05)',
          border: '1.5px solid rgba(255,255,255,0.95)',
        }}
      >
        {/* Logo + Animation */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-28 h-28 animate-wiggle">
            <Lottie animationData={funnyDogAnimation} loop autoplay />
          </div>
          <div className="text-center space-y-1.5">
            <h1
              className="text-4xl font-black tracking-tight"
              style={{ color: '#1E1C2E', letterSpacing: '-0.5px' }}
            >
              Raelo ✦
            </h1>
            <p className="text-sm font-semibold" style={{ color: '#7C6EF0' }}>
              Every stranger, a story.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: '#E2E0F0' }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#A8A6C0' }}>
            sign in
          </span>
          <div className="flex-1 h-px" style={{ background: '#E2E0F0' }} />
        </div>

        {/* Google Login */}
        <div className="w-full flex flex-col items-center gap-4">
          <div className="scale-105 origin-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google login failed. Please try again.')}
              useOneTap={false}
              shape="pill"
            />
          </div>

          {error && (
            <div
              className="w-full px-4 py-3 text-xs font-bold text-center rounded-2xl animate-shake"
              style={{
                background: '#FDE8EF',
                color: '#C44B6E',
                border: '1.5px solid #FFCFDF',
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Trust tags */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {['🔒 Private', '🌍 Global', '✨ Genuine'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-[11px] font-bold"
              style={{ background: '#F2F0FF', color: '#6451D8' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs font-semibold text-center relative z-10" style={{ color: '#A8A6C0' }}>
        By signing in you agree to our terms & community guidelines.
      </p>
    </div>
  );
}
