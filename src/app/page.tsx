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
    <div className="flex-1 flex items-center justify-center bg-cream-50">
      <div className="w-8 h-8 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
    </div>
  );
}
