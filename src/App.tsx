import _ from "lodash";
import React, { useState } from "react";
import "./App.css";
import { DominoDescription } from "./DominoDescription";
import { Direction, MessageType, QueryType } from "./Enums";
import { GameState } from "./GameState";
import { GameView } from "./GameView";
import { GameStartMessage, PlayerDescription } from "./MessageTypes";
import { Player } from "./Player";
const io = require("socket.io-client");

interface IProps {}

export const App = (props: IProps) => {
    const [socket, setSocket] = useState(null);
    const [renderKey, setRenderKey] = useState(0);
    const [gameState, setGameState] = useState<GameState>(null);

    React.useEffect(() => {
        const newSocket = io("http://localhost:3001");

        setSocket(newSocket);
        setUpSocketForGameStart(newSocket);
        return () => newSocket.close();
    }, []);

    const setUpSocketForGameStart = (socket: any) => {
        socket.on(MessageType.GAME_START, (gameDetails: GameStartMessage) => {
            console.log(gameDetails);
            const newGameState = initializeGameState(gameDetails);
            setGameState(newGameState);

            setUpSocketForGameplay(socket, newGameState);

            socket.off(MessageType.GAME_START);
        });
    };

    const initializeGameState = (gameDetails: GameStartMessage) => {
        const newGameState = new GameState();

        gameDetails.players.forEach((player) => {
            newGameState.AddPlayer(
                new Player(
                    player.seatNumber.toString(),
                    player.name,
                    player.isMe,
                    player.seatNumber
                )
            );
        });

        newGameState.Players.filter((player) => !player.IsMe).forEach(
            (player) => {
                const newHand = [];
                for (let i = 0; i < gameDetails.config.n_dominoes; i++) {
                    newHand.push({ direction: Direction.SOUTH });
                }
                player.SetHand(newHand);
            }
        );

        newGameState.Start();
        return newGameState;
    };

    const setUpSocketForGameplay = (socket: any, gameState: GameState) => {
        socket.on(
            MessageType.TURN,
            (turnDescription: {
                seat: number;
                domino: DominoDescription;
                score: number;
            }) => {
                gameState.ProcessTurn(
                    turnDescription.seat,
                    turnDescription.domino,
                    turnDescription.score
                );

                gameState.Me.SetPlayableDominoes(null);
                if (turnDescription.domino) {
                    setRenderKey((key: number) => key + 1);
                }
            }
        );
        socket.on(MessageType.HAND, (payload: any) => {
            console.log(renderKey);
            console.log("Got Hand:", payload);
            gameState.Me.SetHand(payload);
            setRenderKey((key: number) => key + 1);
        });
        socket.on(MessageType.PLAYABLE_DOMINOS, (payload: string) => {
            // console.log(renderKey);
            console.log("Got Playable dominoes:", payload);
            gameState.Me.SetPlayableDominoes(JSON.parse("[" + payload + "]"));
            setRenderKey((key: number) => key + 1);
        });
        socket.on(MessageType.DOMINO_PLAYED, (payload: { player: number }) => {
            console.log(renderKey);
            console.log("Removing opponent domino", payload);
            gameState.Players.find(
                (player) => player.SeatNumber === payload.player && !player.IsMe
            )?.RemoveDomino({ direction: Direction.SOUTH });
            setRenderKey((key: number) => key + 1);
        });
        socket.on(MessageType.CLEAR_BOARD, (payload: string) => {
            console.log(renderKey);
            console.log("Clearing board");
            gameState.ClearBoard();
            setRenderKey((key: number) => key + 1);
        });
        socket.on(MessageType.CURRENT_PLAYER, (payload: number) => {
            console.log(renderKey);
            console.log("Setting current player", payload);
            gameState.SetCurrentPlayer(payload);
            setRenderKey((key: number) => key + 1);
        });

        socket.on(QueryType.DOMINO, (message: string) => {
            console.log("got queried for a domino");
            console.log("message:", message);
            gameState.SetQueryType(QueryType.DOMINO);
        });
        socket.on(QueryType.DIRECTION, (message: string) => {
            console.log("got queried for a direction");
            console.log("message:", message);
            gameState.SetQueryType(QueryType.DIRECTION);
        });

        socket.on(MessageType.GAME_OVER, () => {
            gameState.Finish();
        });
    };

    const respondToQuery = (type: QueryType, value: any) => {
        console.log("responding with type:", type, "with value:", value);
        socket.emit(type, value);
    };

    return (
        <div className="App">
            {gameState ? (
                // Refactor this: don't want to re-render the whole game view on any change,
                // need to figure out a way to get individual components to re-render
                // even though the props currently in use don't force re-renders when they change
                <GameView
                    gameState={gameState}
                    key={renderKey}
                    respond={respondToQuery}
                ></GameView>
            ) : (
                <button
                    className={"game-start-button"}
                    onClick={() => {
                        console.log("starting game");
                        socket?.emit("GAME_START");
                    }}
                >
                    Start
                </button>
            )}
        </div>
    );
};
