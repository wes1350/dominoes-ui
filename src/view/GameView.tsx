import React, { useState } from "react";
import { Board } from "./Board";
import { GameState } from "./GameState";
import { MyPlayerView } from "./MyPlayerView";
import { OpponentPlayerView } from "./OpponentPlayerView";
import { Player } from "./Player";
import "./GameView.css";
import { Direction, QueryType } from "./Enums";
import { UserInput } from "./UserInput";
import { GameLogs } from "./GameLogs";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface IProps {
    gameState: GameState;
    respond: (type: QueryType, value: any) => void;
}

export const GameView = (props: IProps) => {
    const [dominoBeingDragged, setDominoBeingDragged] = useState(null);

    const n_players = props.gameState.N_Players;
    // maps opponent seat number to the display index
    const playerIndices = new Map<number, number>();
    const mySeat = props.gameState.Players.find(
        (player) => player.IsMe
    ).SeatNumber;
    if (n_players === 2) {
        playerIndices.set((mySeat + 1) % n_players, 1);
    } else if (n_players === 3) {
        playerIndices.set((mySeat + 1) % n_players, 2);
        playerIndices.set((mySeat + 2) % n_players, 1);
    } else if (n_players === 4) {
        playerIndices.set((mySeat + 1) % n_players, 2);
        playerIndices.set((mySeat + 2) % n_players, 1);
        playerIndices.set((mySeat + 3) % n_players, 3);
    }

    const me = props.gameState.Players.find((player: Player) => player.IsMe);
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="game-view">
                <div className={"board-container"}>
                    <Board
                        dominoDescriptions={[...props.gameState.Dominos]}
                        onDropDomino={(
                            domino: { face1: number; face2: number },
                            direction: Direction
                        ) => {
                            const dominoIndex = props.gameState.Players[
                                props.gameState.CurrentPlayer
                            ].Hand.findIndex(
                                (dominoInHand) =>
                                    dominoInHand.face1 === domino.face1 &&
                                    dominoInHand.face2 === domino.face2
                            );
                            props.respond(props.gameState.CurrentQueryType, {
                                domino: dominoIndex,
                                direction: direction
                            });
                        }}
                        dominoBeingDragged={
                            dominoBeingDragged !== null
                                ? props.gameState.Players[
                                      props.gameState.CurrentPlayer
                                  ].Hand[dominoBeingDragged]
                                : null
                        }
                    />
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
                        current={
                            props.gameState.CurrentPlayer === me.SeatNumber
                        }
                        onStartDrag={(index: number) => {
                            setDominoBeingDragged(index);
                        }}
                        onStopDrag={() => {
                            setDominoBeingDragged(null);
                        }}
                    />
                </div>
                <div className={"input-container"}>
                    <UserInput
                        gameState={props.gameState}
                        respond={props.respond}
                    />
                </div>
                <GameLogs logs={props.gameState.Logs} />
            </div>
        </DndProvider>
    );
};
