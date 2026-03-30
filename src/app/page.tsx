'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMatchStore } from '@/stores/useMatchStore';
import { api } from '@/services/api';
import FloatingDots from '@/components/login/FloatingDots';
import { cn } from '@/components/ui/Button';

// SVGs
import img1 from '@/assets/svgs/undraw_connection_ts3f.svg';
import img2 from '@/assets/svgs/undraw_into-the-night_nd84.svg';
import img3 from '@/assets/svgs/undraw_respond_o54z.svg';
import img4 from '@/assets/svgs/undraw_love_9mug.svg';
import img5 from '@/assets/svgs/undraw_night-calls_ge07.svg';
import img6 from '@/assets/svgs/undraw_private-data_7v0o.svg';

const slides = [
    {
        image: img1,
        quote: "New people, new stories.",
    },
    {
        image: img2,
        quote: "Chat with someone, anywhere.",
    },
    {
        image: img4,
        quote: "Find someone who resonates.",
    },
    {
        image: img5,
        quote: "Endless talks, zero pressure.",
    },
    {
        image: img6,
        quote: "Safe, secure, and anonymous.",
    },
    {
        image: img3,
        quote: "Your next conversation starts here.",
    },
];

export default function LoginPage() {
    const router = useRouter();
    const token = useAuthStore((state) => state.token);
    const setAuth = useAuthStore((state) => state.setAuth);
    const roomID = useMatchStore((state) => state.roomID);
    
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Auto-redirect if already logged in
    useEffect(() => {
        if (!isHydrated) return;
        if (token) {
            if (roomID) {
                router.replace('/chat');
            } else {
                router.replace('/home');
            }
        }
    }, [token, roomID, isHydrated, router]);

    // Auto-slide logic
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 8000); // Change slide every 6 seconds
        return () => clearInterval(timer);
    }, []);

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            setIsLoading(true);
            const { credential } = credentialResponse;
            const response = await api.post('/auth/google', { id_token: credential });
            if (response.data?.token) {
                setAuth(response.data.token, response.data.user);
                router.push('/home');
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to authenticate with backend.');
        } finally {
            setIsLoading(false);
        }
    };

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
                    <div className="flex flex-col items-center text-center space-y-12">
                        {/* Image Slider */}
                        <div className="relative w-72 h-72 md:w-[440px] md:h-[440px] flex items-center justify-center">
                            {slides.map((slide, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                                        idx === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
                                    )}
                                >
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={slide.image}
                                            alt={`Slide ${idx}`}
                                            fill
                                            className="object-contain drop-shadow-[0_24px_50px_rgba(124,110,240,0.18)]"
                                            priority
                                        />
                                    </div>
                                    <div className={cn(
                                        "absolute -bottom-10 left-0 right-0 text-center transition-all duration-700",
                                        idx === currentSlide ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                                    )}>
                                        <p className="text-raelo-600/90 font-black italic text-sm md:text-xl tracking-tight">
                                            {slide.quote}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* App Name & Slogan */}
                        <div className="pt-10 space-y-4 opacity-0 animate-fade-in-up [animation-delay:400ms]">
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
                            <div className="relative space-y-10 opacity-0 animate-fade-in-up [animation-delay:1300ms]">
                                <div className={cn("w-full flex justify-center scale-105 origin-center transition-opacity duration-300", isLoading && "opacity-20 pointer-events-none")}>
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => setError('Google login failed. Please try again.')}
                                        useOneTap={false}
                                        shape="pill"
                                    />
                                </div>

                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="flex items-center gap-1.5">
                                            {[0, 1, 2].map((i) => (
                                                <span
                                                    key={i}
                                                    className="w-2 h-2 rounded-full bg-raelo-500"
                                                    style={{
                                                        animation: 'bounceDot 1.1s ease-in-out infinite',
                                                        animationDelay: `${i * 0.16}s`,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

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
                                    <Link href="/terms" className="text-raelo-400 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-raelo-400 hover:underline">Privacy Policy</Link>.
                                </p>
                            </div>

                            {/* Subtle card hover glow */}
                            <div className="absolute inset-0 -z-10 rounded-[48px] bg-raelo-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl" />
                        </div>
                    </div>
                </section>
            </div>

            {/* Global SEO Footer */}
            <footer className="absolute bottom-0 w-full z-20 p-6 flex flex-col items-center justify-center text-xs md:text-sm font-bold text-warm-700/50">
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-2">
                    <Link href="/terms" className="hover:text-raelo-500 transition-colors">Terms of Use</Link>
                    <Link href="/privacy" className="hover:text-raelo-500 transition-colors">Privacy Policy</Link>
                    <Link href="/blog/how-to-start-conversation" className="hover:text-raelo-500 transition-colors">Conversation Starters</Link>
                    <Link href="/blog/anonymous-chat-safety" className="hover:text-raelo-500 transition-colors">Safety Guide</Link>
                </div>
                <div className="flex items-center gap-4 text-warm-700/40">
                    <span>© {new Date().getFullYear()} Raelo.</span>
                    <a href="https://tiktok.com/@raelo.me" target="_blank" rel="noopener noreferrer" className="hover:text-raelo-500 transition-colors">TikTok</a>
                    <a href="https://instagram.com/raelo.me" target="_blank" rel="noopener noreferrer" className="hover:text-raelo-500 transition-colors">Instagram</a>
                </div>
            </footer>
        </main>
    );
}