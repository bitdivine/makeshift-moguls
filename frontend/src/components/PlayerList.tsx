import { useState } from 'react';
import { TrendingUp, TrendingDown, Trophy, Loader2, ChevronUp, ChevronDown } from 'lucide-react';
import type { Player } from '@/backend';
import { useUpdateScore } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';

interface PlayerListProps {
    players: Player[];
    isLoading: boolean;
}

function RankBadge({ rank }: { rank: number }) {
    if (rank === 1) return (
        <div className="flex items-center justify-center w-8 h-8 bg-gold text-charcoal-deep font-display text-lg shadow-gold-sm">
            1
        </div>
    );
    if (rank === 2) return (
        <div className="flex items-center justify-center w-8 h-8 bg-charcoal-light text-foreground font-display text-lg" style={{ color: 'oklch(0.75 0.02 240)' }}>
            2
        </div>
    );
    if (rank === 3) return (
        <div className="flex items-center justify-center w-8 h-8 bg-charcoal-light font-display text-lg" style={{ color: 'oklch(0.65 0.1 50)' }}>
            3
        </div>
    );
    return (
        <div className="flex items-center justify-center w-8 h-8 text-muted-foreground font-display text-base">
            {rank}
        </div>
    );
}

function PlayerRow({ player, rank }: { player: Player; rank: number }) {
    const updateScore = useUpdateScore();
    const [pendingDir, setPendingDir] = useState<'up' | 'down' | null>(null);

    const handleScore = async (dir: 'up' | 'down') => {
        setPendingDir(dir);
        try {
            await updateScore.mutateAsync({
                name: player.name,
                scoreChange: dir === 'up' ? BigInt(10) : BigInt(-10),
            });
        } finally {
            setPendingDir(null);
        }
    };

    const isTop3 = rank <= 3;

    return (
        <div
            className={`
                group flex items-center gap-4 px-4 py-3 border-b border-charcoal-light
                transition-all duration-200 hover:bg-charcoal-light/40
                industrial-pattern
                ${isTop3 ? 'border-l-2 border-l-gold' : 'border-l-2 border-l-transparent'}
                animate-fade-in
            `}
        >
            {/* Rank */}
            <RankBadge rank={rank} />

            {/* Coin icon */}
            <div className="hidden sm:flex items-center justify-center w-8 h-8 flex-shrink-0">
                <img
                    src="/assets/generated/mogul-coin-icon.dim_128x128.png"
                    alt="coin"
                    className="w-7 h-7 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                />
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
                <span className={`
                    font-heading font-semibold text-base uppercase tracking-wide truncate block
                    ${rank === 1 ? 'text-gold' : 'text-foreground'}
                `}>
                    {player.name}
                </span>
                {rank === 1 && (
                    <span className="flex items-center gap-1 text-gold-dim text-xs font-body">
                        <Trophy className="w-3 h-3" /> Top Mogul
                    </span>
                )}
            </div>

            {/* Score */}
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <div className={`font-display text-2xl leading-none ${rank === 1 ? 'text-gold glow-gold' : 'text-foreground'}`}>
                        {player.score.toString()}
                    </div>
                    <div className="text-muted-foreground text-xs font-body uppercase tracking-wider">pts</div>
                </div>

                {/* Score controls */}
                <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => handleScore('up')}
                        disabled={updateScore.isPending}
                        className="
                            flex items-center justify-center w-6 h-6
                            bg-charcoal-light hover:bg-gold hover:text-charcoal-deep
                            text-muted-foreground border border-charcoal-light hover:border-gold
                            transition-all duration-150 disabled:opacity-40
                        "
                        title="+10 points"
                    >
                        {pendingDir === 'up' && updateScore.isPending
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : <ChevronUp className="w-3 h-3" />
                        }
                    </button>
                    <button
                        onClick={() => handleScore('down')}
                        disabled={updateScore.isPending}
                        className="
                            flex items-center justify-center w-6 h-6
                            bg-charcoal-light hover:bg-destructive hover:text-foreground
                            text-muted-foreground border border-charcoal-light hover:border-destructive
                            transition-all duration-150 disabled:opacity-40
                        "
                        title="-10 points"
                    >
                        {pendingDir === 'down' && updateScore.isPending
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : <ChevronDown className="w-3 h-3" />
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}

export function PlayerList({ players, isLoading }: PlayerListProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col gap-0">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-charcoal-light">
                        <Skeleton className="w-8 h-8 bg-charcoal-light" />
                        <Skeleton className="w-8 h-8 rounded-full bg-charcoal-light" />
                        <Skeleton className="flex-1 h-5 bg-charcoal-light" />
                        <Skeleton className="w-16 h-8 bg-charcoal-light" />
                    </div>
                ))}
            </div>
        );
    }

    if (players.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-charcoal-light">
                    <Trophy className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                    <p className="font-heading text-lg uppercase tracking-widest text-muted-foreground">
                        No Moguls Yet
                    </p>
                    <p className="font-body text-sm text-muted-foreground mt-1">
                        Be the first to claim your empire.
                    </p>
                </div>
            </div>
        );
    }

    const sorted = [...players].sort((a, b) => Number(b.score - a.score));

    return (
        <div className="flex flex-col">
            {sorted.map((player, index) => (
                <PlayerRow key={player.name} player={player} rank={index + 1} />
            ))}
        </div>
    );
}
