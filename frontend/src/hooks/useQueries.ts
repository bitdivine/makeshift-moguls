import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Player } from '../backend';

export function useGetAllPlayers() {
    const { actor, isFetching } = useActor();

    return useQuery<Player[]>({
        queryKey: ['players'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllPlayers();
        },
        enabled: !!actor && !isFetching,
    });
}

export function useGetPlayer(name: string) {
    const { actor, isFetching } = useActor();

    return useQuery<Player>({
        queryKey: ['player', name],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.getPlayer(name);
        },
        enabled: !!actor && !isFetching && !!name,
    });
}

export function useCreatePlayer() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (name: string) => {
            if (!actor) throw new Error('Actor not available');
            return actor.createPlayer(name);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['players'] });
        },
    });
}

export function useUpdateScore() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ name, scoreChange }: { name: string; scoreChange: bigint }) => {
            if (!actor) throw new Error('Actor not available');
            return actor.updateScore(name, scoreChange);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['players'] });
        },
    });
}
