import React from "react";
import "./App.css";
import { MessageType } from "@root/enums/MessageType";
import { QueryType } from "@root/enums/QueryType";
import { GameState, IGameState } from "@root/model/GameStateModel";
import { GameView } from "@root/view/GameView";
import {
    GameStartMessage,
    GameLogMessage,
    NewRoundMessage
} from "./MessageTypes";
import { Player } from "@root/model/PlayerModel";
import { observer } from "mobx-react-lite";
import { io } from "socket.io-client";
import { GameConfig } from "./model/GameConfigModel";
import { DominoDescription } from "./DominoDescription";
import { DominoModel } from "./model/DominoModel";
import { Domino } from "./view/Domino";
import { Direction } from "./enums/Direction";

export const App = observer(() => {
    let socket: io.Socket;
    let gameState: IGameState;

    React.useEffect(() => {
        const newSocket = io.Socket("http://localhost:3001");

        socket = newSocket;
        setUpSocketForGameStart(newSocket);
        return () => newSocket.close();
    }, []);

    const setUpSocketForGameStart = (socket: any) => {
        socket.on(MessageType.GAME_START, (gameDetails: GameStartMessage) => {
            gameState = initializeGameState(gameDetails);
            setUpSocketForGameplay(socket, gameState);

            socket.off(MessageType.GAME_START);
        });
    };

    const initializeGameState = (gameDetails: GameStartMessage) => {
        const gameConfig = GameConfig.create({
            HAND_SIZE: gameDetails.config.n_dominoes,
            N_PLAYERS: gameDetails.players.length
        });
        const newGameState = GameState.create({
            config: gameConfig
        });

        gameDetails.players.forEach((player) => {
            newGameState.AddPlayer(
                Player.create({
                    Name: player.name,
                    SeatNumber: player.seatNumber,
                    IsMe: player.isMe
                })
            );
        });

        newGameState.Start();
        return newGameState;
    };

    const setUpSocketForGameplay = (socket: any, gameState: IGameState) => {
        socket.on(MessageType.GAME_LOG, (logDetails: GameLogMessage) => {
            console.log(logDetails);
            gameState.AddLog(logDetails.message);
        });
        socket.on(
            MessageType.TURN,
            (turnDescription: { seat: number; domino: DominoDescription }) => {
                const domino = turnDescription.domino
                    ? DominoModel.create({
                          Face1: turnDescription.domino.face1,
                          Face2: turnDescription.domino.face2
                      })
                    : null;

                gameState.ProcessTurn(domino);
                gameState.Me.SetPlayableDominoes(null);
            }
        );
        socket.on(
            MessageType.SCORE,
            (payload: { seat: number; score: number }) => {
                gameState.ProcessScore(payload.seat, payload.score);
            }
        );
        socket.on(MessageType.HAND, (payload: any) => {
            gameState.Me.SetHand(payload);
        });
        socket.on(MessageType.PLAYABLE_DOMINOS, (payload: string) => {
            gameState.Me.SetPlayableDominoes(JSON.parse("[" + payload + "]"));
        });
        socket.on(MessageType.DOMINO_PLAYED, (payload: { seat: number }) => {
            const player = gameState.PlayerAtSeat(payload.seat);
            if (!player.IsMe) {
                player.RemoveDomino();
            }
        });
        socket.on(MessageType.CLEAR_BOARD, () => {
            gameState.ClearBoard();
        });
        socket.on(MessageType.PULL, (payload: { seat: number }) => {
            const player = gameState.PlayerAtSeat(payload.seat);
            if (!player.IsMe) {
                player.AddDomino(DominoModel.create({ Face1: -1, Face2: -1 }));
            }
        });
        socket.on(MessageType.NEW_ROUND, (payload: NewRoundMessage) => {
            gameState.SetCurrentPlayer(payload.currentPlayer);
            gameState.InitializeOpponentHands();
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
                <GameView
                    gameState={gameState}
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
});
