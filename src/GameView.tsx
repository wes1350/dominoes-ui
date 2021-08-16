import React from "react";
import { Board } from "./Board";
import { GameState } from "./GameState";
import { MyPlayerView } from "./MyPlayerView";
import { OpponentPlayerView } from "./OpponentPlayerView";
import { Player } from "./Player";
import "./GameView.css";
import { QueryType } from "./Enums";
import { UserInput } from "./UserInput";

interface IProps {
    gameState: GameState;
    respond: (type: QueryType, value: any) => void;
}

export const GameView = (props: IProps) => {
    const n_players = props.gameState.N_Players;
    // maps opponent seat number to the display index
    const playerIndices = new Map<number, number>();
    const mySeat = props.gameState.Players.find(
        (player) => player.IsMe
    ).SeatNumber;
    if (n_players === 2) {
        playerIndices.set((mySeat + 1) % n_players, 1);
        console.log(mySeat);
        console.log(playerIndices.get((mySeat + 1) % n_players));
    } else if (n_players === 3) {
        playerIndices.set((mySeat + 1) % n_players, 2);
        playerIndices.set((mySeat + 2) % n_players, 1);
        console.log(mySeat);
        console.log(playerIndices.get((mySeat + 1) % n_players));
        console.log(playerIndices.get((mySeat + 2) % n_players));
    } else if (n_players === 4) {
        playerIndices.set((mySeat + 1) % n_players, 2);
        playerIndices.set((mySeat + 2) % n_players, 1);
        playerIndices.set((mySeat + 3) % n_players, 3);
    }
    console.log("in game view");

    const me = props.gameState.Players.find((player: Player) => player.IsMe);
    return (
        <div className="game-view">
            <div className={"board-container"}>
                <Board dominoDescriptions={[...props.gameState.Dominos]} />
            </div>
            <div className={"player-container"}>
                {props.gameState.Players.filter(
                    (player: Player) => !player.IsMe
                ).map((player: Player, i: number) => {
                    return (
                        <OpponentPlayerView
                            key={i}
                            index={playerIndices.get(player.SeatNumber)}
                            player={player}
                            current={
                                props.gameState.CurrentPlayer ===
                                player.SeatNumber
                            }
                        />
                    );
                })}
                <MyPlayerView
                    player={me}
                    current={props.gameState.CurrentPlayer === me.SeatNumber}
                />
            </div>
            <div className={"input-container"}>
                <UserInput
                    gameState={props.gameState}
                    respond={props.respond}
                />
            </div>
            <div className={"test"}>{props.gameState?.Dominos.length}</div>
        </div>
    );
};
