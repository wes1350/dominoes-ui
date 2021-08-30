import { IGameState, IGameStateModel } from "@root/model/GameStateModel";
import { IPlayer } from "@root/model/PlayerModel";

export const GameStateViewModel = (model: IGameStateModel) => {
    const gameState = model as IGameState;

    return {
        get Me(): IPlayer {
            return gameState.players.find((player) => player.IsMe);
        },

        get Opponents(): IPlayer[] {
            return gameState.players.filter((player) => !player.IsMe);
        },

        PlayerAtSeat(seat: number): IPlayer {
            return gameState.players.find(
                (player) => player.SeatNumber === seat
            );
        }
    };
};
