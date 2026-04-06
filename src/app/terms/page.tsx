'use client';

import Link from 'next/link';
import FloatingDots from '@/components/login/FloatingDots';
import { useLocaleStore } from '@/stores/useLocaleStore';
import { translations } from '@/locales/translations';
import { useEffect, useState } from 'react';

export default function TermsPage() {
    const { locale } = useLocaleStore();
    const [isHydrated, setIsHydrated] = useState(false);
    useEffect(() => { setIsHydrated(true); }, []);
    const t = translations[locale]?.terms || translations.en.terms;

    if (!isHydrated) return null;

    return (
        <main className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-hidden bg-warm-50 font-sans">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-raelo-50/90 via-warm-100/60 to-blush-100/40" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_var(--color-raelo-100)_0%,_transparent_60%)] opacity-40 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_var(--color-blush-100)_0%,_transparent_60%)] opacity-30 blur-3xl" />
                <FloatingDots />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
            </div>

            <div className="relative z-10 w-full max-w-4xl h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] flex flex-col">
                <div className="bg-white/45 backdrop-blur-3xl border border-white/70 rounded-[48px] p-8 md:p-12 shadow-[0_40px_80px_-24px_rgba(124,110,240,0.12)] flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between mb-8 border-b border-raelo-500/10 pb-6 shrink-0">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-raelo-600">
                            {t?.title || "Terms of Use"}
                        </h1>
                        <Link 
                            href="/" 
                            className="text-sm font-bold text-raelo-500 hover:text-raelo-600 transition-colors bg-white/50 px-6 py-2 rounded-full border border-raelo-500/20 shadow-sm"
                        >
                            {t?.backBtn || "Back"}
                        </Link>
                    </div>

                    <div className="overflow-y-auto pr-4 custom-scrollbar text-warm-900/80 leading-relaxed space-y-8 flex-1">
                        <section>
                            <p>{t?.content || "Welcome to Raelo. By using our service, you agree to these terms."}</p>
                        </section>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(124, 110, 240, 0.2); border-radius: 10px; }
            `}</style>
        </main>
    );
}
