import { PlayerController } from "@root/controller/PlayerController";
import { Instance, types } from "mobx-state-tree";
import { DominoModel } from "./DominoModel";

export const PlayerModel = types.model({
    Name: types.string,
    SeatNumber: types.number,
    Hand: types.array(types.late(() => DominoModel)),
    PlayableDominoes: types.maybeNull(types.array(types.number)),
    Score: 0,
    IsMe: types.boolean
});

export type IPlayerModel = Instance<typeof PlayerModel>;

export const Player = PlayerModel.actions(PlayerController);
export type IPlayer = Instance<typeof Player>;
