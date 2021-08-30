import { GameStateController } from "@root/controller/GameStateController";
import { QueryType } from "@root/enums/QueryType";
import { GameStateViewModel } from "@root/viewmodel/GameStateViewModel";
import { Instance, types } from "mobx-state-tree";
import { BoardDomino } from "./BoardDominoModel";
import { GameConfig } from "./GameConfigModel";
import { Player } from "./PlayerModel";

export const GameStateModel = types.model({
    config: types.late(() => GameConfig),
    started: false,
    gameOver: false,
    currentPlayer: types.maybeNull(types.integer),
    players: types.array(types.late(() => Player)),
    addedDominos: types.array(types.late(() => BoardDomino)),
    logs: types.array(types.string),
    currentQueryType: types.maybeNull(
        types.enumeration<QueryType>("QueryType", Object.values(QueryType))
    )
});

export type IGameStateModel = Instance<typeof GameStateModel>;

export const GameState =
    GameStateModel.actions(GameStateController).views(GameStateViewModel);
export type IGameState = Instance<typeof GameState>;
