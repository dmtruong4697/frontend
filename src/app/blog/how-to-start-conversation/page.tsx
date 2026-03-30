import { Metadata } from 'next';
import Link from 'next/link';
import FloatingDots from '@/components/login/FloatingDots';

export const metadata: Metadata = {
    title: 'Icebreakers: How to Start a Fun Anonymous Conversation | Raelo',
    description: 'Learn the best ways to open a chat, keep the conversation flowing, and make genuine connections with strangers online on Raelo.',
};

export default function HowToStartConversationPage() {
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

            {/* Content Card - Full Height */}
            <div className="relative z-10 w-full max-w-4xl h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] flex flex-col">
                <div className="bg-white/45 backdrop-blur-3xl border border-white/70 rounded-[48px] p-8 md:p-12 shadow-[0_40px_80px_-24px_rgba(124,110,240,0.12)] flex flex-col h-full overflow-hidden">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 border-b border-raelo-500/10 pb-6 shrink-0">
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-raelo-600">
                            Icebreakers & Tips
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
                            <h2 className="text-xl md:text-2xl font-bold text-warm-900 mb-4">How to Start a Fun Anonymous Conversation</h2>
                            <p>
                                Starting a conversation with a complete stranger can be intimidating, but it's also the magic behind random chat platforms like <strong>Raelo</strong>. Skipping the boring "hi" or "asl" (age/sex/location) can completely change the trajectory of your chat. Here are some of the best ways to break the ice and create memorable, meaningful moments online.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-warm-900 mb-4">1. Skip the "Hi, How are you?"</h2>
                            <p className="mb-3">
                                Generic greetings invite generic responses. If you want a fun conversation, try plunging straight into a quirky topic or a fun question. This forces the other person to think and immediately establishes a playful dynamic.
                            </p>
                            <div className="bg-white/60 p-5 rounded-2xl border border-raelo-200">
                                <strong>Try these instead:</strong>
                                <ul className="list-disc pl-5 mt-2 space-y-2">
                                    <li>"What's a controversial food opinion you hold?" (e.g., Pineapple on pizza)</li>
                                    <li>"If you had to survive a zombie apocalypse using only the object to your immediate left, how long do you last?"</li>
                                    <li>"Tell me the best movie you've watched this year. I need recommendations."</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-warm-900 mb-4">2. Play "Would You Rather"</h2>
                            <p className="mb-3">
                                People love games, especially simple ones. Starting a chat with a rapid-fire game of "Would You Rather" immediately drops the tension and creates natural banter.
                            </p>
                            <div className="bg-white/60 p-5 rounded-2xl border border-raelo-200">
                                <strong>Good examples:</strong>
                                <ul className="list-disc pl-5 mt-2 space-y-2">
                                    <li>"Would you rather be able to speak every language fluently or play every instrument masterfully?"</li>
                                    <li>"Would you rather constantly feel like you have to sneeze, or constantly feel like you're about to trip?"</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-warm-900 mb-4">3. Use Shared Interests (The Raelo Way)</h2>
                            <p>
                                Raelo's matching algorithm pairs you with people who share your selected interests, whether it's Anime, Tech, or Music. The best way to start a conversation is to immediately leverage that common ground. 
                            </p>
                            <p className="mt-2 font-medium italic text-raelo-600">
                                "Hey! I saw we matched on the 'Music' tag. What have you been listening to heavily this week?"
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl md:text-2xl font-bold text-warm-900 mb-4">4. Be Enthusiastic and Polite</h2>
                            <p>
                                Remember that the person on the other end is human. Being overly polite, using emojis, and matching their energy can go a long way. If they give brief, one-word answers, don't take it personally—just hit the **"Find Next Match"** button and try again! Sometimes, chemistry is just about right timing.
                            </p>
                        </section>

                        <section className="pt-10 pb-4 border-t border-raelo-500/10 text-sm text-warm-700/50">
                            <strong>Note:</strong> While chatting should be fun, always remember to protect your personal identity. Never share your real phone number, address, or banking information on anonymous platforms.
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
