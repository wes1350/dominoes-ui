import React, { useState } from "react";
import "./App.css";
import { Direction } from "./Direction";
import { DominoDescription } from "./DominoDescription";
import { MessageType } from "./Enums";
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
            (seat: number, domino: DominoDescription, score: number) => {
                gameState.ProcessTurn(seat, domino, score);
            }
        );
        socket.on("QUERY_DOMINO", () => {});
    };

    const setUpSocketForGameFinish = (socket: any) => {
        socket.on(MessageType.GAME_OVER, () => {
            gameState.Finish();
        });
    };

    // socket.on(
    //     "NEW_PLAYER",
    //     (details: {
    //         seatNumber: number;
    //         playerName: string;
    //         isMe: boolean;
    //     }) => {
    //         gameState.AddPlayer(
    //             new Player(
    //                 details.seatNumber.toString(),
    //                 details.playerName,
    //                 details.isMe,
    //                 details.seatNumber
    //             )
    //         );
    //     }
    // );

    // const me = new Player("1", "Me", true, 1);
    // const opponent1 = new Player("2", "Opponent 1", false, 0);
    // const opponent2 = new Player("3", "Opponent 2", false, 3);
    // const opponent3 = new Player("4", "Opponent 3", false, 2);

    // me.SetHand([
    //     { face1: 4, face2: 3, direction: Direction.SOUTH },
    //     { face1: 5, face2: 0, direction: Direction.SOUTH },
    //     { face1: 4, face2: 3, direction: Direction.SOUTH },
    //     { face1: 5, face2: 0, direction: Direction.SOUTH },
    //     { face1: 4, face2: 3, direction: Direction.SOUTH },
    //     { face1: 5, face2: 0, direction: Direction.SOUTH },
    //     { face1: 4, face2: 3, direction: Direction.SOUTH },
    //     { face1: 5, face2: 0, direction: Direction.SOUTH },
    //     { face1: 6, face2: 2, direction: Direction.SOUTH }
    // ]);

    // opponent1.SetHand([
    //     { direction: Direction.SOUTH },
    //     { direction: Direction.SOUTH },
    //     { direction: Direction.SOUTH }
    // ]);

    // opponent2.SetHand([
    //     { direction: Direction.SOUTH },
    //     { direction: Direction.SOUTH },
    //     { direction: Direction.SOUTH }
    // ]);

    // opponent3.SetHand([
    //     { direction: Direction.SOUTH },
    //     { direction: Direction.SOUTH },
    //     { direction: Direction.SOUTH }
    // ]);

    // gameState.AddPlayer(me);
    // gameState.AddPlayer(opponent1);
    // gameState.AddPlayer(opponent2);
    // gameState.AddPlayer(opponent3);

    return (
        <div className="App">
            {gameState ? (
                <GameView gameState={gameState}></GameView>
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

// const started = this.state.started;
// const gameOver = this.state.gameOver;
// let content;
// let scoreInfo = (
//     <ScoreInfo
//         style={{ gridColumn: "1", gridRow: "1" }}
//         socket={this.state.socket}
//     />
// );
// let gameBoard = (
//     <Board
//         style={{ gridColumn: "2", gridRow: "1 / 7" }}
//         socket={this.state.socket}
//     />
// );

// if (started) {
//     if (gameOver) {
//         content = (
//             <div className="gameover-page">
//                 <h3>Game over!</h3>
//                 {scoreInfo}
//                 {gameBoard}
//             </div>
//         );
//     } else {
//         content = (
//             <div className="gameplay-page">
//                 {scoreInfo}
//                 <TextInfo
//                     style={{ gridColumn: "1", gridRow: "2 / 4" }}
//                     socket={this.state.socket}
//                     setResponseType={(type) => {
//                         this.setState({ responseType: type });
//                     }}
//                 />
//                 <Hand
//                     style={{ gridColumn: "1", gridRow: "4" }}
//                     socket={this.state.socket}
//                 />
//                 <MoveInput
//                     style={{ gridColumn: "1", gridRow: "5" }}
//                     socket={this.state.socket}
//                     responseType={this.state.responseType}
//                 />
//                 {gameBoard}
//             </div>
//         );
//     }
// } else {
//     content = (
//         <>
//             <p>Dominos!</p>
//             <button onClick={this.handleStartButtonClick}>
//                 Start Game
//             </button>
//         </>
//     );
// }
// return <div className="App">{content}</div>;
