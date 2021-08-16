import { DominoDescription } from "./DominoDescription";
import { QueryType } from "./Enums";
import { Player } from "./Player";

export class GameState {
    private _started: boolean;
    private _gameOver: boolean;
    private _currentPlayer: number;
    private _currentQueryType: QueryType;
    private _players: Player[];
    private _addedDominos: DominoDescription[];

    constructor() {
        this._started = false;
        this._gameOver = false;
        this._currentPlayer = null;
        this._players = [];
        this._addedDominos = [];
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

    public ProcessTurn(seat: number, domino: DominoDescription, score: number) {
        console.log("PROCESSING TURN");
        console.log(seat, score, domino);
        if (domino) {
            this._addedDominos = [...this._addedDominos, domino];
        }
        if (score) {
            const currentPlayer = this._players.find(
                (player) => player.SeatNumber === seat
            );
            currentPlayer.SetScore(score + currentPlayer.Score);
        }
        this._currentPlayer = (this._currentPlayer + 1) % this.N_Players;
        console.log(this._addedDominos, this._currentPlayer);
    }

    public SetQueryType(type: QueryType) {
        if (type === QueryType.DIRECTION) {
            this._currentQueryType = QueryType.DIRECTION;
        } else if (type === QueryType.DOMINO) {
            this._currentQueryType = QueryType.DOMINO;
        }
    }

    public SetCurrentPlayer(seat: number) {
        this._currentPlayer = seat;
    }

    public ClearBoard(): void {
        this._addedDominos = [];
    }

    public get GameOver(): boolean {
        return this._gameOver;
    }

    public get CurrentQueryType(): QueryType {
        return this._currentQueryType;
    }

    public get N_Players(): number {
        return this._players.length;
    }

    public get Players(): Player[] {
        return this._players;
    }

    public get CurrentPlayer(): number {
        return this._currentPlayer;
    }

    public get Running(): boolean {
        return this._started;
    }

    public get Me(): Player {
        return this._players.find((player) => player.IsMe);
    }

    public get Dominos(): DominoDescription[] {
        return this._addedDominos;
    }
}
