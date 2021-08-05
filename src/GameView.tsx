import React from "react";
import { Board } from "./Board";
import { Direction } from "./Direction";
import { Domino } from "./Domino";
import { Face } from "./Face";
import { GameState } from "./GameState";
import { MyPlayerView } from "./MyPlayerView";
import { OpponentPlayerView } from "./OpponentPlayerView";
import { Player } from "./Player";

interface IProps {
    gameState: GameState;
}

const d1 = { face1: 5, face2: 1, direction: Direction.WEST, x: 0, y: 0 };
const d2 = { face1: 5, face2: 5, direction: Direction.SOUTH, x: 1, y: 0 };
const d3 = { face1: 5, face2: 3, direction: Direction.EAST, x: 2, y: 0 };
const d4 = { face1: 3, face2: 3, direction: Direction.NORTH, x: 3, y: 0 };
const d5 = { face1: 5, face2: 4, direction: Direction.SOUTH, x: 1, y: -1 };
const d6 = { face1: 5, face2: 2, direction: Direction.NORTH, x: 1, y: 1 };
const d7 = { face1: 2, face2: 2, direction: Direction.EAST, x: 1, y: 2 };
const d8 = { direction: Direction.SOUTH, x: 1, y: -2 };

export const GameView = (props: IProps) => {
    return (
        <div className="game-view">
            {/* <Domino face1={3} face2={2} direction={Direction.NORTH} />
            <Domino face1={3} face2={2} direction={Direction.EAST} />
            <Domino face1={3} face2={2} direction={Direction.SOUTH} />
            <Domino face1={3} face2={2} direction={Direction.WEST} /> */}
            <div className={"board-container"}>
                <Board dominoDescriptions={[d1, d2, d3, d4, d5, d6, d7, d8]} />
            </div>
            {/* <div className={"player-container"}>
                {props.gameState.Players.filter(
                    (player: Player) => !player.IsMe
                ).map((player: Player, i: number) => {
                    <OpponentPlayerView key={i} index={i} player={player} />;
                })}
                <MyPlayerView
                    player={props.gameState.Players.find(
                        (player: Player) => player.IsMe
                    )}
                />
            </div> */}
        </div>
    );
};
