import { Direction } from "./Direction";

export interface DominoDescription {
    face1?: number;
    face2?: number;
    direction: Direction;
    x: number;
    y: number;
}
