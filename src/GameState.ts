import { DominoDescription } from "./DominoDescription";
import { QueryType } from "./Enums";
import { hiddenDomino } from "./HiddenDomino";
import { Player } from "./Player";

export class GameState {
    private _n_dominoes: number;
    private _started: boolean;
    private _gameOver: boolean;
    private _currentPlayer: number;
    private _currentQueryType: QueryType;
    private _players: Player[];
    private _addedDominos: DominoDescription[];
    private _logs: string[];

    constructor(n_dominoes: number) {
        this._n_dominoes = n_dominoes;
        this._started = false;
        this._gameOver = false;
        this._currentPlayer = null;
        this._players = [];
        this._addedDominos = [];
        this._logs = [];
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

    public ProcessTurn(seat: number, domino: DominoDescription) {
        console.log("PROCESSING TURN");
        console.log(seat, domino);
        if (domino) {
            this._addedDominos = [...this._addedDominos, domino];
        }

        this._currentPlayer = (this._currentPlayer + 1) % this.N_Players;
        console.log(this._addedDominos, this._currentPlayer);
    }

    public ProcessScore(seat: number, score: number) {
        const currentPlayer = this._players.find(
            (player) => player.SeatNumber === seat
        );
        currentPlayer.SetScore(score + currentPlayer.Score);
    }

    public SetQueryType(type: QueryType) {
        if (type === QueryType.MOVE) {
            this._currentQueryType = QueryType.MOVE;
        }
    }

    public SetCurrentPlayer(seat: number) {
        this._currentPlayer = seat;
    }

    public SetOpponentHands() {
        this._players
            .filter((player) => !player.IsMe)
            .forEach((player) => {
                const newHand = [];
                for (let i = 0; i < this._n_dominoes; i++) {
                    newHand.push(hiddenDomino());
                }
                player.SetHand(newHand);
            });
    }

    public ClearBoard(): void {
        this._addedDominos = [];
    }

    public PlayerAtSeat(seat: number): Player {
        return this._players.find((player) => player.SeatNumber === seat);
    }

    public AddLog(log: string): void {
        this._logs.push(log);
    }

    public get Logs(): string[] {
        return this._logs;
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
