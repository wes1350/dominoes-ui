import React from "react";
import "./App.css";
import { MessageType } from "./enums/MessageType";
import { QueryType } from "./enums/QueryType";
import { GameState, IGameState } from "./model/GameStateModel";
import { GameView } from "./view/GameView";
import {
    GameStartMessage,
    GameLogMessage,
    NewRoundMessage
} from "./interfaces/Messages";
import { Player } from "./model/PlayerModel";
import { observer, useLocalObservable } from "mobx-react-lite";
import { GameConfig } from "./model/GameConfigModel";
import { Domino, IDomino } from "./model/DominoModel";
import { SnapshotIn } from "mobx-state-tree";
import { Coordinate } from "./interfaces/Coordinate";
import { Direction } from "./enums/Direction";
import { Board } from "model/BoardModel";
const io = require("socket.io-client");

export const App = observer(() => {
    const localStore = useLocalObservable(() => ({
        socket: null,
        gameState: null
    }));

    React.useEffect(() => {
        const newSocket = io("http://localhost:3001");

        localStore.socket = newSocket;
        setUpSocketForGameStart(newSocket);
        return () => newSocket.close();
    }, []);

    const setUpSocketForGameStart = (socket: any) => {
        console.log(socket);
        socket.on(MessageType.GAME_START, (gameDetails: GameStartMessage) => {
            console.log("starting game");
            localStore.gameState = initializeGameState(gameDetails);
            setUpSocketForGameplay(socket, localStore.gameState);

            socket.off(MessageType.GAME_START);
        });
    };

    const initializeGameState = (gameDetails: GameStartMessage) => {
        const gameConfig = GameConfig.create({
            HAND_SIZE: gameDetails.config.n_dominoes,
            N_PLAYERS: gameDetails.players.length
        });
        const newGameState = GameState.create({
            Config: gameConfig,
            Board: Board.create({})
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
            (turnDescription: {
                seat: number;
                domino: SnapshotIn<IDomino>;
                direction: Direction;
                coordinate: Coordinate;
            }) => {
                const domino = turnDescription.domino
                    ? Domino.create(turnDescription.domino)
                    : null;

                gameState.ProcessTurn(
                    domino,
                    turnDescription.direction,
                    turnDescription.coordinate
                );
                gameState.Me.SetPlayableDominoes(null);
            }
        );
        socket.on(
            MessageType.SCORE,
            (payload: { seat: number; score: number }) => {
                gameState.ProcessScore(payload.seat, payload.score);
            }
        );
        socket.on(
            MessageType.HAND,
            (payload: { Face1: number; Face2: number }[]) => {
                gameState.Me.SetHand(payload as IDomino[]);
            }
        );
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
                player.AddDomino(Domino.create({ Face1: -1, Face2: -1 }));
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
        localStore.socket.emit(type, value);
    };

    return (
        <div className="App">
            {localStore.gameState ? (
                <GameView
                    gameState={localStore.gameState}
                    respond={respondToQuery}
                ></GameView>
            ) : (
                <button
                    className={"game-start-button"}
                    onClick={() => {
                        localStore.socket?.emit("GAME_START");
                    }}
                >
                    Start
                </button>
            )}
        </div>
    );
});
