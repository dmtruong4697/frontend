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
        background: 'linear-gradient(135deg, #E8F5EF 0%, #F7F4F0 45%, #FEE8D8 100%)',
        minHeight: '100dvh',
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-[-80px] left-[-80px] w-56 h-56 rounded-full pointer-events-none"
        style={{ background: 'rgba(124,185,160,0.18)', filter: 'blur(48px)' }}
      />
      <div
        className="absolute bottom-[-60px] right-[-60px] w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'rgba(244,162,97,0.14)', filter: 'blur(56px)' }}
      />
      <div
        className="absolute top-1/2 left-[-40px] w-40 h-40 rounded-full pointer-events-none"
        style={{ background: 'rgba(124,185,160,0.10)', filter: 'blur(40px)' }}
      />

      {/* Card */}
      <div
        className="w-full max-w-sm flex flex-col items-center gap-8 relative z-10 animate-fade-in-up"
        style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(20px)',
          borderRadius: '2.5rem',
          padding: '2.5rem 2rem',
          boxShadow: '0 8px 48px rgba(124,185,160,0.18), 0 2px 12px rgba(0,0,0,0.06)',
          border: '1.5px solid rgba(255,255,255,0.9)',
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
              style={{ color: '#2E2E2E', letterSpacing: '-0.5px' }}
            >
              Matcha 🍵
            </h1>
            <p className="text-sm font-semibold" style={{ color: '#7CB9A0' }}>
              Meet someone new today
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: '#E8E2DA' }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#B0A89E' }}>
            sign in
          </span>
          <div className="flex-1 h-px" style={{ background: '#E8E2DA' }} />
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
                background: '#FDE8E8',
                color: '#D96060',
                border: '1.5px solid #F5C0C0',
              }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Trust tags */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {['🔒 Secure', '🎲 Random', '✨ Friendly'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-[11px] font-bold"
              style={{ background: '#F0F8F5', color: '#5A9E87' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs font-semibold text-center relative z-10" style={{ color: '#B0A89E' }}>
        By signing in you agree to our terms & community guidelines.
      </p>
    </div>
  );
}
