import { Player } from "./Player";

export class GameState {
    private _gameOver: boolean;
    private _responseType: string;
    private _players: Player[];

    constructor() {
        this._gameOver = false;
        this._responseType = null;
        this._players = [];
    }

    public AddPlayer(player: Player) {
        this._players.push(player);
    }

    public get GameOver(): boolean {
        return this._gameOver;
    }

    public get ResponseType(): string {
        return this._responseType;
    }

    public get N_Players(): number {
        return this._players.length;
    }

    public get Players(): Player[] {
        return this._players;
    }
}
