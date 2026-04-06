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
        <main className="relative min-h-screen w-full flex flex-col overflow-x-hidden bg-warm-50 font-sans">
            {/* Unified Background Layer (Fixed for scrollability) */}
            <div className="fixed inset-0 z-0">
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

            {/* Content Overlay (Min 1 Screen Height) */}
            <div className="relative z-10 w-full flex-1 flex flex-col md:flex-row items-center justify-center md:items-stretch min-h-[100svh] pt-12 md:pt-0 pb-12">

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

            {/* SEO Content Section (>250 Words, H1/Title matching) */}
            <article className="relative z-10 w-full max-w-5xl mx-auto px-4 md:px-8 py-20 animate-fade-in-up [animation-delay:400ms]">
                <div className="group relative bg-[#ffffff66] backdrop-blur-3xl border border-white/80 rounded-[48px] p-8 md:p-16 shadow-[0_40px_80px_-24px_rgba(124,110,240,0.12),0_20px_40px_-12px_rgba(0,0,0,0.02)] transition-all duration-700 hover:shadow-[0_60px_100px_-30px_rgba(124,110,240,0.18)]">
                    
                    <div className="max-w-3xl mx-auto space-y-12">
                        {/* Header Section */}
                        <div className="text-center space-y-6">
                            <div className="inline-flex items-center justify-center p-3 bg-raelo-500/10 rounded-2xl mb-2 text-raelo-500">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-raelo-600 to-blush-500 bg-clip-text text-transparent drop-shadow-sm pb-2">
                                Experience Random Talks and Real Moments
                            </h2>
                            <p className="text-lg md:text-xl text-warm-800/80 font-medium leading-relaxed max-w-2xl mx-auto">
                                Welcome to Raelo, the premier destination for engaging in random talks with complete strangers from around the world. We fundamentally believe that <strong className="text-raelo-600 font-bold">every stranger has a story</strong> worth hearing. Whether you are looking to kill time, make a new online friend, or simply explore different perspectives, Raelo guarantees real moments and authentic connections without the pressure of a traditional social network.
                            </p>
                        </div>

                        {/* Split Features */}
                        <div className="grid md:grid-cols-2 gap-6 pt-6">
                            <div className="bg-white/60 backdrop-blur-md border border-white/80 p-8 rounded-[32px] shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group/card">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover/card:opacity-20 transition-opacity duration-300">
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14.5c-2.5 0-4.5-2-4.5-4.5h2c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5c-2.46 0-4.5-2.04-4.5-4.501 0-2.46 2.04-4.5 4.5-4.5 2.5 0 4.5 2 4.5 4.5h-2c0-1.38-1.12-2.5-2.5-2.5s-2.5 1.12-2.5 2.5 1.12 2.5 2.5 2.5c2.46 0 4.5 2.04 4.5 4.501 0 2.46-2.04 4.5-4.5 4.5z"/></svg>
                                </div>
                                <h3 className="text-xl font-bold text-warm-900 mb-4 relative z-10">Why every stranger has a story</h3>
                                <p className="text-warm-800/70 font-medium leading-relaxed relative z-10">
                                    In today's fast-paced digital world, genuine interactions are rare. On Raelo, the person on the other end of your screen brings a lifetime of unique experiences. We eliminate the superficial aspects of social media, allowing you to dive straight into the conversation. It is a space where every stranger has a story, and you have the absolute freedom to listen, share, and connect on a deeply human level.
                                </p>
                            </div>

                            <div className="bg-white/60 backdrop-blur-md border border-white/80 p-8 rounded-[32px] shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group/card">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover/card:opacity-20 transition-opacity duration-300">
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold text-warm-900 mb-4 relative z-10">Random Talks, Made Safe</h3>
                                <p className="text-warm-800/70 font-medium leading-relaxed relative z-10">
                                    While discovering that every stranger has a story is exciting, your safety comes first. Raelo is built differently. We enforce a strict anonymity protocol where no personal identifiable information is shared by default. If a conversation takes a turn you dislike, you can instantly disconnect and find a new match. Random talks should lead to real moments, not anxiety, which is why our reporting and moderation systems work around the clock.
                                </p>
                            </div>
                        </div>

                        {/* Closing Thoughts */}
                        <div className="pt-8 border-t border-raelo-500/10 space-y-5 text-center px-4">
                            <p className="text-warm-800/70 font-medium leading-relaxed text-lg">
                                We designed Raelo specifically for those who crave meaningful spontaneity. The internet used to be a place to discover the unknown and forge spontaneous friendships. Raelo brings that magic back. Our intelligent matching system ensures that your random talks are paired with users who share similar intrinsic interests, increasing the likelihood that those talks turn into real moments you'll remember.
                            </p>
                            <p className="text-warm-800/70 font-medium leading-relaxed text-lg">
                                Ready to find out what happens next? There is no complex sign-up required. Simply click the secure Google Login button above, define your basic interests, and let the algorithm introduce you to the world. <strong className="text-raelo-600 font-bold opacity-90">Remember: stay respectful, stay safe, and embrace the fact that every stranger has a story!</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </article>

            {/* Global SEO Footer */}
            <footer className="relative w-full z-20 p-8 border-t border-raelo-500/10 flex flex-col items-center justify-center text-xs md:text-sm font-bold text-warm-700/50 bg-white/20 backdrop-blur-md">
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-4">
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