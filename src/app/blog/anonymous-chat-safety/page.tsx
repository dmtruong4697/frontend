import { Metadata } from 'next';
import Link from 'next/link';
import FloatingDots from '@/components/login/FloatingDots';

export const metadata: Metadata = {
    title: 'The Ultimate Guide to Safe Anonymous Chatting | Raelo',
    description: 'Learn how to protect your privacy online, deal with inappropriate behavior, and stay safe while chatting with strangers on Raelo.',
};

export default function AnonymousChatSafetyPage() {
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
                            Chat Safety Guide
                        </h1>
                        <Link 
                            href="/" 
                            className="text-sm font-bold text-raelo-500 hover:text-raelo-600 transition-colors bg-white/50 px-6 py-2 rounded-full border border-raelo-500/20 shadow-sm"
                        >
                            Back Home
                        </Link>
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto pr-4 custom-scrollbar text-warm-900/80 leading-relaxed space-y-8 flex-1">
                        
                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-warm-900 mb-4">The Ultimate Guide to Safe Anonymous Chatting</h2>
                            <p>
                                Connecting with people globally is an incredible experience. On platforms like <strong>Raelo</strong> and Omegle, you can learn about different cultures, practice languages, or just kill time talking to a stranger. However, the anonymous nature of the internet requires you to be smart about your digital footprint. Here is how you can stay 100% safe.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-warm-900 mb-4">1. Never Reveal PII (Personally Identifiable Information)</h2>
                            <p>
                                PII includes any data that could be used to directly locate or contact you in real life. If you want to remain secure, treat every stranger online with caution, even if they seem friendly.
                            </p>
                            <div className="mt-3 bg-white/60 p-5 rounded-2xl border border-raelo-200">
                                <strong>Information you should NEVER share:</strong>
                                <ul className="list-disc pl-5 mt-2 space-y-2">
                                    <li>Your full legal name or your address.</li>
                                    <li>Where you go to school or your workplace.</li>
                                    <li>Your personal phone number.</li>
                                    <li>Links to your private Instagram or Facebook. (Use a "burner" social account for internet friends).</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-warm-900 mb-4">2. Avoid clicking suspicious links</h2>
                            <p>
                                A common tactic maliciously used on anonymous chat platforms is sending shortened URLs or "IP grabber" links. 
                            </p>
                            <p className="mt-3">
                                If your chat partner abruptly sends a link (e.g., <em>"Check out my picture here!"</em>), do not click it. These links can log your IP address, exposing your physical location, or try to run malicious scripts on your browser. Raelo does not support image sharing in chat specifically to mitigate this issue.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-warm-900 mb-4">3. Know when to "Next" someone</h2>
                            <p>
                                The beauty of anonymous chatting is that you owe the other person absolutely nothing. If someone is making you uncomfortable, asking weird questions, or being abusive: <strong>Leave instantly.</strong> You do not need to explain yourself or argue.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-error-600 mb-4 italic">4. Use the Report feature</h2>
                            <p>
                                We want Raelo to be a warm, welcoming community. If you encounter bots, scammers, or individuals violating community guidelines (such as sharing explicit content or hate speech), use the <strong>Report button</strong> at the top of the chat interface.
                            </p>
                            <p className="mt-2 text-warm-700">
                                Clicking "Report" will instantly end the session and send the chat history to our moderation team. Repeat offenders are permanently hardware-banned from joining Raelo queues.
                            </p>
                        </section>

                        <section className="pt-10 pb-4 border-t border-raelo-500/10 text-sm text-warm-700/50">
                            <strong>Summary:</strong> Always prioritize your comfort. Online chatting is supposed to be fun. If a conversation stops being fun, move on to the next story!
                        </section>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(124, 110, 240, 0.2); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(124, 110, 240, 0.4); }
            `}} />
        </main>
    );
}
