import { IGameState, IGameStateModel } from "model/GameStateModel";
import { IPlayer } from "model/PlayerModel";

export const GameStateViewModel = (model: IGameStateModel) => {
    const gameState = model as IGameState;

    return {
        get Me(): IPlayer {
            return gameState.Players.find((player) => player.IsMe);
        },

        get Opponents(): IPlayer[] {
            return gameState.Players.filter((player) => !player.IsMe);
        },

        PlayerAtSeat(seat: number): IPlayer {
            return gameState.Players.find(
                (player) => player.SeatNumber === seat
            );
        }
    };
};
