import React from "react";
import { Board } from "./Board";
// import { Direction } from "./Direction";
// import { Domino } from "./Domino";
// import { Face } from "./Face";
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

// const d1 = { face1: 5, face2: 1, direction: Direction.WEST, x: 0, y: 0 };
// const d2 = { face1: 5, face2: 5, direction: Direction.SOUTH, x: 1, y: 0 };
// const d3 = { face1: 5, face2: 3, direction: Direction.EAST, x: 2, y: 0 };
// const d4 = { face1: 3, face2: 3, direction: Direction.NORTH, x: 3, y: 0 };
// const d5 = { face1: 5, face2: 4, direction: Direction.SOUTH, x: 1, y: -1 };
// const d6 = { face1: 5, face2: 2, direction: Direction.NORTH, x: 1, y: 1 };
// const d7 = { face1: 2, face2: 2, direction: Direction.EAST, x: 1, y: 2 };
// const d8 = { face1: 2, face2: 3, direction: Direction.NORTH, x: 1, y: 3 };
// const d9 = { face1: 3, face2: 0, direction: Direction.NORTH, x: 1, y: 4 };
// const d10 = { face1: 0, face2: 6, direction: Direction.NORTH, x: 1, y: 5 };
// const d11 = { face1: 6, face2: 6, direction: Direction.WEST, x: 1, y: 6 };
// const d12 = { face1: 6, face2: 1, direction: Direction.NORTH, x: 1, y: 7 };
// const d13 = { face1: 4, face2: 4, direction: Direction.EAST, x: 1, y: -2 };
// const d14 = { face1: 4, face2: 6, direction: Direction.SOUTH, x: 1, y: -3 };
// const d15 = { face1: 6, face2: 3, direction: Direction.SOUTH, x: 1, y: -4 };
// const d16 = { face1: 3, face2: 1, direction: Direction.SOUTH, x: 1, y: -5 };
// const d17 = { face1: 1, face2: 1, direction: Direction.WEST, x: 1, y: -6 };
// const d18 = { face1: 1, face2: 2, direction: Direction.SOUTH, x: 1, y: -7 };

// const d19 = { face1: 3, face2: 4, direction: Direction.EAST, x: 4, y: 0 };
// const d20 = { face1: 4, face2: 5, direction: Direction.EAST, x: 5, y: 0 };
// const d21 = { face1: 5, face2: 6, direction: Direction.EAST, x: 6, y: 0 };
// const d22 = { face1: 6, face2: 6, direction: Direction.SOUTH, x: 7, y: 0 };
// const d23 = { face1: 6, face2: 1, direction: Direction.EAST, x: 8, y: 0 };
// const d24 = { face1: 1, face2: 2, direction: Direction.EAST, x: 9, y: 0 };
// const d25 = { face1: 2, face2: 2, direction: Direction.SOUTH, x: 10, y: 0 };
// const d26 = { face1: 2, face2: 3, direction: Direction.EAST, x: 11, y: 0 };

// const d27 = { face1: 1, face2: 2, direction: Direction.WEST, x: -1, y: 0 };
// const d28 = { face1: 2, face2: 3, direction: Direction.WEST, x: -2, y: 0 };
// const d29 = { face1: 3, face2: 3, direction: Direction.NORTH, x: -3, y: 0 };
// const d30 = { face1: 3, face2: 4, direction: Direction.WEST, x: -4, y: 0 };
// const d31 = { face1: 4, face2: 5, direction: Direction.WEST, x: -5, y: 0 };
// const d32 = { face1: 5, face2: 5, direction: Direction.SOUTH, x: -6, y: 0 };
// const d33 = { face1: 5, face2: 6, direction: Direction.WEST, x: -7, y: 0 };
// const d34 = { face1: 6, face2: 6, direction: Direction.NORTH, x: -8, y: 0 };
// const d35 = { face1: 0, face2: 6, direction: Direction.EAST, x: -9, y: 0 };
// const d36 = { face1: 1, face2: 0, direction: Direction.EAST, x: -10, y: 0 };
// const d37 = { face1: 1, face2: 1, direction: Direction.NORTH, x: -11, y: 0 };
// const d38 = { face1: 1, face2: 4, direction: Direction.WEST, x: -12, y: 0 };

// const d8 = { direction: Direction.EAST, x: 1, y: -2 };

export const GameView = (props: IProps) => {
    const n_players = props.gameState.N_Players;
    // maps opponent seat number to the display index
    const playerIndices = new Map<number, number>();
    const mySeat = props.gameState.Players.find((player) =>
        player.IsMe()
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

    return (
        <div className="game-view">
            {/* <Domino face1={3} face2={2} direction={Direction.NORTH} />
            <Domino face1={3} face2={2} direction={Direction.EAST} />
            <Domino face1={3} face2={2} direction={Direction.SOUTH} />
            <Domino face1={3} face2={2} direction={Direction.WEST} /> */}
            <div className={"board-container"}>
                <Board
                    dominoDescriptions={props.gameState.Dominos}
                    // dominoDescriptions={[
                    //     d1,
                    //     d2,
                    //     d3,
                    //     d4,
                    //     d5,
                    //     d6,
                    //     d7,
                    //     d8,
                    //     d9,
                    //     d10,
                    //     d11,
                    //     d12,
                    //     d13,
                    //     d14,
                    //     d15,
                    //     d16,
                    //     d17,
                    //     d18,
                    //     d19,
                    //     d20,
                    //     d21,
                    //     d22,
                    //     d23,
                    //     d24,
                    //     d25,
                    //     d26,
                    //     d27,
                    //     d28,
                    //     d29,
                    //     d30,
                    //     d31,
                    //     d32,
                    //     d33,
                    //     d34,
                    //     d35,
                    //     d36,
                    //     d37,
                    //     d38
                    // ]}
                />
            </div>
            <div className={"player-container"}>
                {props.gameState.Players.filter(
                    (player: Player) => !player.IsMe()
                ).map((player: Player, i: number) => {
                    return (
                        <OpponentPlayerView
                            key={i}
                            index={playerIndices.get(player.SeatNumber)}
                            player={player}
                        />
                    );
                })}
                <MyPlayerView
                    player={props.gameState.Players.find((player: Player) =>
                        player.IsMe()
                    )}
                />
                <UserInput
                    gameState={props.gameState}
                    respond={props.respond}
                />
            </div>
        </div>
    );
};
