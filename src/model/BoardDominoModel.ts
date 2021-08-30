import { BoardDominoController } from "@root/controller/BoardDominoController";
import { Direction } from "@root/enums/Direction";
import { BoardDominoViewModel } from "@root/viewmodel/BoardDominoViewModel";
import { Instance, types } from "mobx-state-tree";
import { DominoModel } from "./DominoModel";

export const BoardDominoModel = types.model({
    Domino: types.late(() => DominoModel),
    X: types.number,
    Y: types.number,
    IsSpinner: false,
    Direction: types.enumeration<Direction>(
        "Direction",
        Object.values(Direction)
    )
});

export type IBoardDominoModel = Instance<typeof BoardDominoModel>;

export const BoardDomino = BoardDominoModel.actions(
    BoardDominoController
).views(BoardDominoViewModel);
export type IBoardDomino = Instance<typeof BoardDomino>;
