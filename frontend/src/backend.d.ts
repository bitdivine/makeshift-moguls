import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Player {
    name: string;
    score: bigint;
}
export interface backendInterface {
    createPlayer(name: string): Promise<void>;
    getAllPlayers(): Promise<Array<Player>>;
    getPlayer(name: string): Promise<Player>;
    updateScore(name: string, scoreChange: bigint): Promise<void>;
}
