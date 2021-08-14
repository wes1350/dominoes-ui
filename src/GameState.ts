import { DominoDescription } from "./DominoDescription";
import { QueryType } from "./Enums";
import { Player } from "./Player";

export class GameState {
    private _started: boolean;
    private _gameOver: boolean;
    private _currentTurn: number;
    private _currentQueryType: QueryType;
    private _players: Player[];
    private _addedDominos: DominoDescription[];

    constructor() {
        this._started = false;
        this._gameOver = false;
        this._currentTurn = null;
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
        if (domino) {
            this._addedDominos.push(domino);
        }
        if (score) {
            const currentPlayer = this._players.find(
                (player) => player.SeatNumber === seat
            );
            currentPlayer.SetScore(score + currentPlayer.Score);
        }
        this._currentTurn = (this._currentTurn + 1) % this.N_Players;
    }

    public AddDominoToBoard(desc: DominoDescription) {
        this._addedDominos.push(desc);
    }

    public SetQueryType(type: QueryType) {
        if (type === QueryType.DIRECTION) {
            this._currentQueryType = QueryType.DIRECTION;
        } else if (type === QueryType.DOMINO) {
            this._currentQueryType = QueryType.DOMINO;
        }
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

    public get Running(): boolean {
        return this._started;
    }

    public get Me(): Player {
        return this._players.find((player) => player.IsMe());
    }

    public get Dominos(): DominoDescription[] {
        return this._addedDominos;
    }
}
