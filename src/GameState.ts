import { DominoDescription } from "./DominoDescription";
import { Player } from "./Player";

export class GameState {
    private _started: boolean;
    private _gameOver: boolean;
    private _responseType: string;
    private _players: Player[];

    constructor() {
        this._started = false;
        this._gameOver = false;
        this._responseType = null;
        this._players = [];
    }

    public AddPlayer(player: Player) {
        this._players.push(player);
    }

    public Start() {
        this._started = true;
    }

    public Finish() {
        this._gameOver = true;
    }

    public ProcessTurn(turn: { seat: number; domino: DominoDescription }) {
        //
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

    public get Running(): boolean {
        return this._started;
    }
}
