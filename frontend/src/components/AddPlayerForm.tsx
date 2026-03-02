import { useState } from 'react';
import { UserPlus, Loader2 } from 'lucide-react';
import { useCreatePlayer } from '@/hooks/useQueries';

interface AddPlayerFormProps {
    onSuccess?: () => void;
}

export function AddPlayerForm({ onSuccess }: AddPlayerFormProps) {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const createPlayer = useCreatePlayer();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) {
            setError('Enter a mogul name to join the empire.');
            return;
        }
        setError('');
        try {
            await createPlayer.mutateAsync(trimmed);
            setName('');
            onSuccess?.();
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            if (msg.includes('already exists')) {
                setError('That mogul already exists. Choose a different name.');
            } else {
                setError('Failed to add mogul. Try again.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex flex-col gap-3">
                <label
                    htmlFor="mogul-name"
                    className="font-heading text-sm font-semibold uppercase tracking-widest text-gold-dim"
                >
                    Mogul Name
                </label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            id="mogul-name"
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="Enter your empire name..."
                            maxLength={40}
                            disabled={createPlayer.isPending}
                            className={`
                                w-full bg-charcoal-deep border px-4 py-3
                                font-heading text-base font-medium text-foreground
                                placeholder:text-muted-foreground
                                focus:outline-none focus:ring-2 focus:ring-gold/50
                                disabled:opacity-50 disabled:cursor-not-allowed
                                transition-all duration-200
                                ${error ? 'border-destructive' : 'border-charcoal-light focus:border-gold'}
                            `}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={createPlayer.isPending || !name.trim()}
                        className="
                            flex items-center gap-2 px-6 py-3
                            bg-gold text-charcoal-deep
                            font-heading font-bold text-sm uppercase tracking-widest
                            border border-gold
                            hover:bg-gold-bright hover:border-gold-bright
                            disabled:opacity-40 disabled:cursor-not-allowed
                            transition-all duration-200
                            shadow-gold-sm hover:shadow-gold
                            active:scale-95
                            whitespace-nowrap
                        "
                    >
                        {createPlayer.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <UserPlus className="w-4 h-4" />
                        )}
                        {createPlayer.isPending ? 'Enrolling...' : 'Join Empire'}
                    </button>
                </div>
                {error && (
                    <p className="text-destructive text-sm font-body animate-fade-in">{error}</p>
                )}
                {createPlayer.isSuccess && (
                    <p className="text-gold text-sm font-body animate-fade-in">
                        ✦ Mogul enrolled successfully!
                    </p>
                )}
            </div>
        </form>
    );
}
