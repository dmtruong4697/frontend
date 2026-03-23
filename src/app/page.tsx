'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMatchStore } from '@/stores/useMatchStore';

export default function RootPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const roomID = useMatchStore((state) => state.roomID);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (token) {
      if (roomID) {
        router.replace('/chat');
      } else {
        router.replace('/home');
      }
    } else {
      router.replace('/login');
    }
  }, [token, roomID, isHydrated, router]);

  return (
    <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--background)' }}>
      {/* Bouncing dots loader */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-3 h-3 rounded-full"
            style={{
              background: '#7CB9A0',
              animation: `bounceDot 1.2s ease-in-out infinite`,
              animationDelay: `${i * 0.18}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
