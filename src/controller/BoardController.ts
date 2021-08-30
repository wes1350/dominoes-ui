import { Direction } from "@root/enums/Direction";
import { Coordinate } from "@root/interfaces/Coordinate";
import { BoardDomino } from "@root/model/BoardDominoModel";
import { IBoard, IBoardModel } from "@root/model/BoardModel";
import { IDomino } from "@root/model/DominoModel";
import { cast } from "mobx-state-tree";

export const BoardController = (model: IBoardModel) => {
    const board = model as IBoard;

    const rotateDirection = (direction: Direction) => {
        return direction === Direction.NORTH
            ? Direction.EAST
            : direction === Direction.EAST
            ? Direction.SOUTH
            : direction === Direction.SOUTH
            ? Direction.WEST
            : Direction.NORTH;
    };

    return {
        AddDomino(
            domino: IDomino,
            direction: Direction,
            location: Coordinate
        ): void {
            const boardDomino = BoardDomino.create({
                Domino: domino,
                Direction: direction,
                Location: location,
                BoundingBox: boundingBox
            });

            board.Dominoes.push(boardDomino);

            if (domino.IsDouble && !board.Spinner) {
                board.Spinner = boardDomino;
            }
        },

        ClearBoard() {
            board.Dominoes = cast([]);
        }
    };
};
