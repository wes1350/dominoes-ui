import React, { useState } from "react";
import "./App.css";
import { DominoDescription } from "./DominoDescription";
import { MessageType, QueryType } from "./Enums";
import { GameState } from "./GameState";
import { GameView } from "./GameView";
import { hiddenDomino } from "./HiddenDomino";
import {
    GameStartMessage,
    GameLogMessage,
    NewRoundMessage
} from "./MessageTypes";
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
        const newGameState = new GameState(gameDetails.config.n_dominoes);

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

        newGameState.Start();
        return newGameState;
    };

    const setUpSocketForGameplay = (socket: any, gameState: GameState) => {
        socket.on(MessageType.GAME_LOG, (logDetails: GameLogMessage) => {
            console.log(logDetails);
            gameState.AddLog(logDetails.message);
            setRenderKey((key: number) => key + 1);
        });
        socket.on(
            MessageType.TURN,
            (turnDescription: { seat: number; domino: DominoDescription }) => {
                gameState.ProcessTurn(
                    turnDescription.seat,
                    turnDescription.domino
                );

                gameState.Me.SetPlayableDominoes(null);
                if (turnDescription.domino) {
                    setRenderKey((key: number) => key + 1);
                }
            }
        );
        socket.on(
            MessageType.SCORE,
            (payload: { seat: number; score: number }) => {
                gameState.ProcessScore(payload.seat, payload.score);
                setRenderKey((key: number) => key + 1);
            }
        );
        socket.on(MessageType.HAND, (payload: any) => {
            gameState.Me.SetHand(payload);
            setRenderKey((key: number) => key + 1);
        });
        socket.on(MessageType.PLAYABLE_DOMINOS, (payload: string) => {
            gameState.Me.SetPlayableDominoes(JSON.parse("[" + payload + "]"));
            setRenderKey((key: number) => key + 1);
        });
        socket.on(MessageType.DOMINO_PLAYED, (payload: { seat: number }) => {
            const player = gameState.PlayerAtSeat(payload.seat);
            if (!player.IsMe) {
                player.RemoveDomino(hiddenDomino());
            }
            setRenderKey((key: number) => key + 1);
        });
        socket.on(MessageType.CLEAR_BOARD, () => {
            gameState.ClearBoard();
            setRenderKey((key: number) => key + 1);
        });
        socket.on(MessageType.PULL, (payload: { seat: number }) => {
            const player = gameState.PlayerAtSeat(payload.seat);
            if (!player.IsMe) {
                player.AddDomino(hiddenDomino());
            }
            setRenderKey((key: number) => key + 1);
        });
        socket.on(MessageType.NEW_ROUND, (payload: NewRoundMessage) => {
            gameState.SetCurrentPlayer(payload.currentPlayer);
            gameState.SetOpponentHands();
            setRenderKey((key: number) => key + 1);
        });

        socket.on(QueryType.MOVE, (message: string) => {
            gameState.SetQueryType(QueryType.MOVE);
        });

        socket.on(MessageType.GAME_OVER, (winner: number) => {
            gameState.Finish();
        });
    };

    const respondToQuery = (type: QueryType, value: any) => {
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
                        socket?.emit("GAME_START");
                    }}
                >
                    Start
                </button>
            )}
        </div>
    );
};
