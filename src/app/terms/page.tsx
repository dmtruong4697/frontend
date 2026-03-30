'use client';

import Link from 'next/link';
import FloatingDots from '@/components/login/FloatingDots';

export default function TermsPage() {
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
                            Terms of Use
                        </h1>
                        <Link 
                            href="/" 
                            className="text-sm font-bold text-raelo-500 hover:text-raelo-600 transition-colors bg-white/50 px-6 py-2 rounded-full border border-raelo-500/20 shadow-sm"
                        >
                            Back
                        </Link>
                    </div>

                    {/* Scrollable Content - Ensured Scrolling */}
                    <div className="overflow-y-auto pr-4 custom-scrollbar text-warm-900/80 leading-relaxed space-y-8 flex-1">
                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-warm-900 mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing and using <strong>Raelo</strong>, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-error-600 mb-4 italic underline underline-offset-8 decoration-error-500/30">2. Age Requirement</h2>
                            <p className="font-bold text-warm-900 text-lg">
                                This service is strictly intended for users aged 18 and older.
                            </p>
                            <p className="mt-2 text-warm-700">
                                Providing false age information or using the service while underage constitutes a material breach of these terms and will result in an immediate account ban upon discovery.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-warm-900 mb-4">3. Code of Conduct</h2>
                            <p>You agree <strong>NOT</strong> to engage in the following prohibited behaviors:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-3">
                                <li><strong>Inappropriate Content:</strong> Sharing or distributing pornographic, obscene, or sexually explicit content.</li>
                                <li><strong>Hate Speech & Harassment:</strong> Harassing, threatening, insulting, or defaming any other user.</li>
                                <li><strong>Illegal Activities:</strong> Spreading fake news, propaganda, or any content that violates the laws of Vietnam or your local jurisdiction, including cybersecurity regulations.</li>
                                <li><strong>System Abuse:</strong> Using bots, malware, or any technical method to disrupt the platform's standard operations.</li>
                                <li><strong>Impersonation:</strong> Impersonating any person or entity.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-warm-900 mb-4">4. Consequences of Violation</h2>
                            <p>
                                Raelo reserves the right to suspend or terminate your access permanently without prior notice if you violate any of these terms.
                            </p>
                            <p className="mt-2 italic text-raelo-600 font-medium">
                                Note: We retain technical identification information and activity logs to cooperate with law enforcement authorities in the event of serious legal violations, in accordance with local internet service management regulations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-warm-900 mb-4">5. Limitation of Liability</h2>
                            <p>
                                Raelo is a random matching platform. We are not responsible for user-generated content or any damages arising directly or indirectly from your interactions with other users. You are solely responsible for your own safety and the personal information you choose to share during chat sessions.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-warm-900 mb-4">6. Changes to Terms</h2>
                            <p>
                                We may update these terms from time to time. Your continued use of the platform after such changes signifies your acceptance of the updated terms.
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
