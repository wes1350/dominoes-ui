import { DominoDescription } from "./DominoDescription";

export class Player {
    private _isMe: boolean;
    private _id: string;
    private _name: string;
    private _hand: DominoDescription[];
    private _score: number;
    private _seatNumber: number;

    constructor(id: string, name: string, isMe: boolean, seat: number) {
        this._id = id;
        this._name = name;
        this._isMe = isMe;
        this._score = 0;
        this._hand = [];
        this._seatNumber = seat;
    }

    public SetHand(hand: DominoDescription[]) {
        this._hand = hand;
    }

    public SetScore(score: number) {
        this._score = score;
    }

    public get SeatNumber() {
        return this._seatNumber;
    }

    public get Score() {
        return this._score;
    }

    public get Id() {
        return this._id;
    }

    public get Name() {
        return this._name;
    }

    public get Hand() {
        return this._hand;
    }

    public IsMe() {
        return this._isMe;
    }
}
