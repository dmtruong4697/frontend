'use client';

import Link from 'next/link';
import FloatingDots from '@/components/login/FloatingDots';

export default function PrivacyPage() {
    return (
        <main className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-hidden bg-warm-50 font-sans">
            {/* Unified Background Layer */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-raelo-50/90 via-warm-100/60 to-blush-100/40" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_var(--color-raelo-100)_0%,_transparent_60%)] opacity-40 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,_var(--color-blush-100)_0%,_transparent_60%)] opacity-30 blur-3xl" />
                <FloatingDots />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
            </div>

            {/* Content Card - Full Height Fix */}
            <div className="relative z-10 w-full max-w-4xl h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] flex flex-col">
                <div className="bg-white/45 backdrop-blur-3xl border border-white/70 rounded-[48px] p-8 md:p-12 shadow-[0_40px_80px_-24px_rgba(124,110,240,0.12)] flex flex-col h-full overflow-hidden">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 border-b border-raelo-500/10 pb-6 shrink-0">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-raelo-600">
                            Privacy Policy
                        </h1>
                        <Link 
                            href="/login" 
                            className="text-sm font-bold text-raelo-500 hover:text-raelo-600 transition-colors bg-white/50 px-6 py-2 rounded-full border border-raelo-500/20 shadow-sm"
                        >
                            Back
                        </Link>
                    </div>

                    {/* Scrollable Content - Ensured Scrolling */}
                    <div className="overflow-y-auto pr-4 custom-scrollbar text-warm-900/80 leading-relaxed space-y-8 flex-1">
                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-warm-900 mb-4">1. Introduction</h2>
                            <p>
                                Welcome to <strong>Raelo</strong>. We respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information when you use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-warm-900 mb-4">2. Data We Collect</h2>
                            <ul className="list-disc pl-5 space-y-3">
                                <li><strong>Identity Information:</strong> We collect your name and email address from your Google account when you sign in via Google OAuth.</li>
                                <li><strong>Technical Information:</strong> We automatically collect your IP address, device type, operating system, and browser information for pairing and security purposes.</li>
                                <li><strong>Usage Data:</strong> We track access times and matching history to improve our service and prevent platform abuse.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-warm-900 mb-4">3. How We Use Your Data</h2>
                            <p>We use the collected data to:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-3">
                                <li>Provide and maintain our random chat matching service.</li>
                                <li>Monitor and prevent illegal activities, harassment, or spam, in compliance with standard safety protocols and local regulations.</li>
                                <li>Enhance user experience and optimize system performance.</li>
                                <li>Support dispute resolution or investigate reports of misconduct from other users.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-warm-900 mb-4">4. Your Rights</h2>
                            <p>
                                You have the following rights regarding your personal data:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-3">
                                <li>The right to access or receive a copy of your personal data.</li>
                                <li>The right to request correction or deletion of your personal data.</li>
                                <li>The right to withdraw consent for data processing at any time (this may limit your ability to use our service).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-warm-900 mb-4">5. Storage and Security</h2>
                            <p>
                                Your personal data is stored securely on encrypted servers. We implement industry-standard technical and organizational measures to prevent unauthorized access, alteration, or disclosure of your information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-warm-900 mb-4">6. Third-Party Services</h2>
                            <p>
                                We use Google for authentication. Google's use of your info is governed by their own privacy policies. We do not sell your personal data to third parties for marketing purposes.
                            </p>
                        </section>

                        <section className="pt-10 pb-4 border-t border-raelo-500/10 text-sm text-warm-700/50">
                            Last Updated: March 29, 2026.
                        </section>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(124, 110, 240, 0.2);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(124, 110, 240, 0.4);
                }
            `}</style>
        </main>
    );
}
