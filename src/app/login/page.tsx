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

      // Call backend to verify and get JWT
      const response = await api.post('/auth/google', {
        id_token: credential,
      });

      if (response.data?.token) {
        setAuth(response.data.token, response.data.user);
        router.push('/home');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to authenticate with backend.');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-cream-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-matcha-100 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-50" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-matcha-300 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl opacity-20" />

      <div className="w-full max-w-sm flex flex-col items-center gap-10 bg-white p-10 rounded-[3rem] border-2 border-matcha-100 shadow-2xl shadow-matcha-600/10 relative z-10">
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 flex items-center justify-center relative">
            <div className="relative z-10 w-32 h-32">
              <Lottie
                animationData={funnyDogAnimation}
                loop={true}
                autoplay={true}
              />
            </div>
          </div>
          <div className="text-center space-y-2 mt-2">
            <h1 className="text-3xl font-black tracking-tight text-forest-900 italic">Matcha</h1>
            <p className="text-sm text-matcha-600 font-bold px-4">
              {/* Where strangers become friends over a cup of virtual tea. 🍵 */}
              Chúng tôi đái vào cốc matcha của bạn 🍵
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-6">
          <div className="scale-110">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setError('Google login failed. Please try again.');
              }}
              useOneTap={false}
              shape="pill"
            />
          </div>

          {error && (
            <div className="w-full p-4 rounded-2xl bg-rose-50 border-2 border-rose-100 text-rose-500 text-xs font-bold text-center animate-shake">
              {error}
            </div>
          )}

          <p className="text-[10px] text-forest-700 font-bold uppercase tracking-widest opacity-60 mt-2">
            Secure • Random • Friendly
          </p>
        </div>
      </div>
    </div>
  );
}
