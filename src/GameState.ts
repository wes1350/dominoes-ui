export class GameState {
    private _gameOver: boolean;
    private _responseType: string;
    private _players: any[];

    constructor() {}

    public get GameOver(): boolean {
        return this._gameOver;
    }

    public get ResponseType(): string {
        return this._responseType;
    }

    public get N_Players(): number {
        return this._players.length;
    }

    public get Players(): any {
        return this._players;
    }
}
