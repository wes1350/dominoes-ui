import { GameEventType } from "enums/GameEventType";

export interface GameEvent {
    Type: GameEventType;
    Duration: number;
    Seat?: number;
    Score?: number;
}
