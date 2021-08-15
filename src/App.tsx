import React, { useState } from "react";
import "./App.css";
import { DominoDescription } from "./DominoDescription";
import { Direction, MessageType, QueryType } from "./Enums";
import { GameState } from "./GameState";
import { GameView } from "./GameView";
import { Player } from "./Player";
const io = require("socket.io-client");

interface IProps {}

interface PlayerDescription {
    seatNumber: number;
    name: string;
    isMe: boolean;
}

export const App = (props: IProps) => {
    const [socket, setSocket] = useState(null);
    const [nDominos, setNDominos] = useState(0);
    const [gameState, setGameState] = useState<GameState>(null);

    React.useEffect(() => {
        const newSocket = io("http://localhost:3001");

        setSocket(newSocket);
        setUpSocketForGameStart(newSocket);
        return () => newSocket.close();
    }, []);

    const setUpSocketForGameStart = (socket: any) => {
        socket.on(
            MessageType.GAME_START,
            (gameDetails: {
                players: PlayerDescription[];
                dominoes: { face1: number; face2: number }[];
            }) => {
                console.log(gameDetails);
                const newGameState = initializeGameState(gameDetails);
                setGameState(newGameState);

                setUpSocketForGameplay(socket, newGameState);
                setUpSocketForGameFinish(socket);

                socket.off(MessageType.GAME_START);
            }
        );
    };

    const initializeGameState = (gameDetails: {
        players: PlayerDescription[];
        dominoes: { face1: number; face2: number }[];
    }) => {
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

        const hand = gameDetails.dominoes.map(
            (domino: { face1: number; face2: number }) => {
                return { ...domino, direction: Direction.SOUTH };
            }
        );
        newGameState.Me.SetHand(hand);
        newGameState.Players.filter((player) => !player.IsMe()).forEach(
            (player) => {
                const newHand = [];
                for (let i = 0; i < hand.length; i++) {
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
                if (turnDescription.domino) {
                    setNDominos((oldN: number) => oldN + 1);
                }
            }
        );
        socket.on(QueryType.DOMINO, async (message: string) => {
            console.log("got queried for a domino");
            console.log("message:", message);
            gameState.SetQueryType(QueryType.DOMINO);
        });
        socket.on(QueryType.DIRECTION, async (message: string) => {
            console.log("got queried for a direction");
            console.log("message:", message);
            gameState.SetQueryType(QueryType.DIRECTION);
        });
    };

    const setUpSocketForGameFinish = (socket: any) => {
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
                <GameView
                    gameState={gameState}
                    nDominos={nDominos}
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
