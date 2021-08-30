import { BoardDominoController } from "@root/controller/BoardDominoController";
import { Direction } from "@root/enums/Direction";
import { Coordinate } from "@root/interfaces/Coordinate";
import { BoardDominoViewModel } from "@root/viewmodel/BoardDominoViewModel";
import { Instance, types } from "mobx-state-tree";
import { BoundingBox } from "./BoundingBoxModel";
import { Domino } from "./DominoModel";

export const BoardDominoModel = types.model({
    Domino: types.late(() => Domino),
    Location: types.frozen<Coordinate>(),
    Direction: types.enumeration<Direction>(
        "Direction",
        Object.values(Direction)
    ),
    BoundingBox: types.late(() => BoundingBox)
});

export type IBoardDominoModel = Instance<typeof BoardDominoModel>;

export const BoardDomino = BoardDominoModel.actions(
    BoardDominoController
).views(BoardDominoViewModel);
export type IBoardDomino = Instance<typeof BoardDomino>;
