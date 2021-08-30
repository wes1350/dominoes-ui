import { Direction } from "enums/Direction";
import { QueryType } from "enums/QueryType";
import { Coordinate } from "interfaces/Coordinate";
import { DominoModel, IDomino } from "model/DominoModel";
import { IGameState, IGameStateModel } from "model/GameStateModel";
import { IPlayer } from "model/PlayerModel";
import _ from "lodash";

export const GameStateController = (model: IGameStateModel) => {
    const gameState = model as IGameState;

    return {
        AddPlayer(player: IPlayer) {
            gameState.Players.push(player);
        },

        Start() {
            gameState.Started = true;
        },

        Finish() {
            gameState.GameOver = true;
        },

        ProcessTurn(
            domino: IDomino,
            direction: Direction,
            coordinate: Coordinate
        ) {
            if (domino) {
                gameState.Board.AddDomino(domino, direction, coordinate);
            }

            gameState.CurrentPlayer =
                (gameState.CurrentPlayer + 1) % gameState.Config.N_PLAYERS;
        },

        ProcessScore(seat: number, score: number) {
            const currentPlayer = gameState.Players.find(
                (player) => player.SeatNumber === seat
            );
            currentPlayer.SetScore(score + currentPlayer.Score);
        },

        SetQueryType(type: QueryType) {
            if (type === QueryType.MOVE) {
                gameState.CurrentQueryType = QueryType.MOVE;
            } else {
                throw new Error(`Invalid query type: ${type}`);
            }
        },

        SetCurrentPlayer(seat: number) {
            gameState.CurrentPlayer = seat;
        },

        InitializeOpponentHands() {
            gameState.Opponents.forEach((player) => {
                player.SetHand(
                    _.range(0, gameState.Config.HAND_SIZE).map(() =>
                        DominoModel.create({
                            Face1: -1,
                            Face2: -1
                        })
                    )
                );
            });
        },

        ClearBoard(): void {
            gameState.Board.ClearBoard();
        },

        AddLog(log: string): void {
            gameState.Logs.push(log);
        }
    };
};
