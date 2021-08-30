import { Direction } from "@root/enums/Direction";
import { QueryType } from "@root/enums/QueryType";
import { IBoardDomino } from "@root/model/BoardDominoModel";
import { DominoModel, IDominoModel } from "@root/model/DominoModel";
import { IGameState, IGameStateModel } from "@root/model/GameStateModel";
import { IPlayer } from "@root/model/PlayerModel";
import _ from "lodash";
import { cast } from "mobx-state-tree";

export const GameStateController = (model: IGameStateModel) => {
    const gameState = model as IGameState;

    return {
        AddPlayer(player: IPlayer) {
            gameState.players.push(player);
        },

        Start() {
            gameState.started = true;
        },

        Finish() {
            gameState.gameOver = true;
        },

        ProcessTurn(domino: IDominoModel) {
            if (domino) {
                gameState.addedDominos.push(domino);
            }

            gameState.currentPlayer =
                (gameState.currentPlayer + 1) % gameState.config.N_PLAYERS;
        },

        ProcessScore(seat: number, score: number) {
            const currentPlayer = gameState.players.find(
                (player) => player.SeatNumber === seat
            );
            currentPlayer.SetScore(score + currentPlayer.Score);
        },

        SetQueryType(type: QueryType) {
            if (type === QueryType.MOVE) {
                gameState.currentQueryType = QueryType.MOVE;
            } else {
                throw new Error(`Invalid query type: ${type}`);
            }
        },

        SetCurrentPlayer(seat: number) {
            gameState.currentPlayer = seat;
        },

        InitializeOpponentHands() {
            gameState.Opponents.forEach((player) => {
                player.SetHand(
                    _.range(0, gameState.config.HAND_SIZE).map(() =>
                        DominoModel.create({
                            Face1: -1,
                            Face2: -1
                        })
                    )
                );
            });
        },

        ClearBoard(): void {
            gameState.addedDominos = cast([]);
        },

        AddLog(log: string): void {
            gameState.logs.push(log);
        }
    };
};
