import { useState } from 'react';
import { TrendingUp, Users, RefreshCw } from 'lucide-react';
import { useGetAllPlayers } from '@/hooks/useQueries';
import { AddPlayerForm } from '@/components/AddPlayerForm';
import { PlayerList } from '@/components/PlayerList';
import { Toaster } from '@/components/ui/sonner';

function Header() {
    return (
        <header className="relative w-full bg-charcoal-deep border-b border-charcoal-light overflow-hidden">
            {/* Diagonal stripe accent */}
            <div className="absolute inset-0 industrial-pattern opacity-60 pointer-events-none" />
            <div className="absolute top-0 left-0 w-1 h-full bg-gold" />

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
                {/* Banner image */}
                <div className="w-full overflow-hidden" style={{ maxHeight: '200px' }}>
                    <img
                        src="/assets/generated/makeshift-moguls-banner.dim_1200x300.png"
                        alt="Makeshift Moguls"
                        className="w-full object-cover object-center"
                        style={{ maxHeight: '200px' }}
                        onError={(e) => {
                            // Fallback if image not found
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>

                {/* Fallback title shown always for branding */}
                <div className="py-6 flex items-end justify-between gap-4">
                    <div>
                        <h1 className="font-display text-5xl sm:text-7xl text-gold glow-gold leading-none tracking-wider">
                            MAKESHIFT
                        </h1>
                        <h1 className="font-display text-5xl sm:text-7xl text-foreground leading-none tracking-wider">
                            MOGULS
                        </h1>
                        <p className="font-heading text-sm uppercase tracking-widest text-muted-foreground mt-2">
                            Build your empire. Dominate the board.
                        </p>
                    </div>
                    <div className="hidden sm:flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 text-gold-dim">
                            <TrendingUp className="w-5 h-5" />
                            <span className="font-heading text-xs uppercase tracking-widest">Leaderboard</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function StatsBar({ playerCount, topScore }: { playerCount: number; topScore: bigint }) {
    return (
        <div className="bg-charcoal-deep border-b border-charcoal-light">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gold-dim" />
                    <span className="font-heading text-sm uppercase tracking-wider text-muted-foreground">
                        Moguls:
                    </span>
                    <span className="font-display text-lg text-gold leading-none">{playerCount}</span>
                </div>
                <div className="w-px h-4 bg-charcoal-light" />
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gold-dim" />
                    <span className="font-heading text-sm uppercase tracking-wider text-muted-foreground">
                        Top Score:
                    </span>
                    <span className="font-display text-lg text-gold leading-none">{topScore.toString()}</span>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    const { data: players = [], isLoading, refetch, isFetching } = useGetAllPlayers();
    const [showForm, setShowForm] = useState(false);

    const topScore = players.length > 0
        ? players.reduce((max, p) => p.score > max ? p.score : max, BigInt(0))
        : BigInt(0);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <StatsBar playerCount={players.length} topScore={topScore} />

            <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-8">

                {/* Add Mogul Section */}
                <section className="bg-card border border-charcoal-light shadow-inner-gold">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal-light">
                        <h2 className="font-display text-2xl text-gold tracking-wider">
                            ENLIST A MOGUL
                        </h2>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="
                                font-heading text-xs uppercase tracking-widest
                                text-muted-foreground hover:text-gold
                                transition-colors duration-200
                                flex items-center gap-1
                            "
                        >
                            {showForm ? '— Collapse' : '+ Expand'}
                        </button>
                    </div>
                    {showForm && (
                        <div className="px-5 py-5 animate-fade-in">
                            <AddPlayerForm onSuccess={() => setShowForm(false)} />
                        </div>
                    )}
                    {!showForm && (
                        <div className="px-5 py-4">
                            <button
                                onClick={() => setShowForm(true)}
                                className="
                                    w-full py-3 border border-dashed border-charcoal-light
                                    text-muted-foreground hover:text-gold hover:border-gold
                                    font-heading text-sm uppercase tracking-widest
                                    transition-all duration-200
                                "
                            >
                                + Add New Mogul to the Empire
                            </button>
                        </div>
                    )}
                </section>

                {/* Leaderboard Section */}
                <section className="bg-card border border-charcoal-light flex flex-col">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-charcoal-light">
                        <h2 className="font-display text-2xl text-gold tracking-wider">
                            EMPIRE RANKINGS
                        </h2>
                        <button
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="
                                flex items-center gap-1.5
                                font-heading text-xs uppercase tracking-widest
                                text-muted-foreground hover:text-gold
                                transition-colors duration-200
                                disabled:opacity-40
                            "
                            title="Refresh rankings"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>

                    {/* Column headers */}
                    {!isLoading && players.length > 0 && (
                        <div className="flex items-center gap-4 px-4 py-2 bg-charcoal-deep border-b border-charcoal-light">
                            <div className="w-8 text-center">
                                <span className="font-heading text-xs uppercase tracking-widest text-muted-foreground">#</span>
                            </div>
                            <div className="hidden sm:block w-8" />
                            <div className="flex-1">
                                <span className="font-heading text-xs uppercase tracking-widest text-muted-foreground">Mogul</span>
                            </div>
                            <div className="text-right pr-8">
                                <span className="font-heading text-xs uppercase tracking-widest text-muted-foreground">Score</span>
                            </div>
                        </div>
                    )}

                    <PlayerList players={players} isLoading={isLoading} />

                    {!isLoading && players.length > 0 && (
                        <div className="px-5 py-3 border-t border-charcoal-light bg-charcoal-deep">
                            <p className="font-body text-xs text-muted-foreground">
                                Hover a mogul to adjust their score. ±10 points per action.
                            </p>
                        </div>
                    )}
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-charcoal-light bg-charcoal-deep mt-auto">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="font-display text-lg text-gold tracking-wider">MAKESHIFT MOGULS</span>
                        <span className="text-muted-foreground text-xs font-body">
                            © {new Date().getFullYear()}
                        </span>
                    </div>
                    <p className="font-body text-xs text-muted-foreground flex items-center gap-1">
                        Built with{' '}
                        <span className="text-gold">♥</span>
                        {' '}using{' '}
                        <a
                            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'makeshift-moguls')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold hover:text-gold-bright transition-colors underline underline-offset-2"
                        >
                            caffeine.ai
                        </a>
                    </p>
                </div>
            </footer>

            <Toaster />
        </div>
    );
}
