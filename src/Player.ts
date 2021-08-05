export class Player {
    private _isMe: boolean;
    private _id: string;
    private _name: string;
    // private _hand: DominoRep[];

    constructor(name: string, isMe: boolean) {
        this._name = name;
        this._isMe = isMe;
    }

    public IsMe() {
        return this._isMe;
    }
}
