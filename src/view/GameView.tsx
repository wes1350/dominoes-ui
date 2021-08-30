import React, { useState } from "react";
import { BoardView } from "./BoardView";
import { IGameState } from "model/GameStateModel";
import { MyPlayerView } from "./MyPlayerView";
import { OpponentPlayerView } from "./OpponentPlayerView";
import "./GameView.css";
import { UserInput } from "./UserInput";
import { GameLogs } from "./GameLogs";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { QueryType } from "enums/QueryType";
import { IPlayer } from "model/PlayerModel";
import { Direction } from "enums/Direction";

interface IProps {
    gameState: IGameState;
    respond: (type: QueryType, value: any) => void;
}

export const GameView = (props: IProps) => {
    const [dominoBeingDragged, setDominoBeingDragged] = useState(null);

    const n_players = props.gameState.Config.N_PLAYERS;
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

    const me = props.gameState.Players.find((player: IPlayer) => player.IsMe);
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="game-view">
                <div className={"board-container"}>
                    <BoardView
                        board={props.gameState.Board}
                        onDropDomino={(
                            domino: { face1: number; face2: number },
                            direction: Direction
                        ) => {
                            const dominoIndex = props.gameState.Players[
                                props.gameState.CurrentPlayer
                            ].Hand.findIndex(
                                (dominoInHand) =>
                                    dominoInHand.Face1 === domino.face1 &&
                                    dominoInHand.Face2 === domino.face2
                            );
                            props.respond(props.gameState.CurrentQueryType, {
                                domino: dominoIndex,
                                direction: direction
                            });
                        }}
                        // dominoBeingDragged={
                        //     dominoBeingDragged !== null
                        //         ? props.gameState.Players[
                        //               props.gameState.CurrentPlayer
                        //           ].Hand[dominoBeingDragged]
                        //         : null
                        // }
                    />
                </div>
                <div className={"player-container"}>
                    {props.gameState.Players.filter(
                        (player: IPlayer) => !player.IsMe
                    ).map((player: IPlayer, i: number) => {
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
