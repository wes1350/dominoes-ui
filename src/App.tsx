import React from "react";
// import Board from "./Board.js";
// import TextInfo from "./TextInfo.js";
// import ScoreInfo from "./ScoreInfo.js";
// import MoveInput from "./MoveInput.js";
// import Hand from "./Hand.js";
import "./App.css";
import { GameState } from "./GameState";
import { GameView } from "./GameView";
import { Player } from "./Player";
const io = require("socket.io-client");

// export enum QueryType {
//     DOMINO = "DOMINO",
//     DIRECTION = "DIRECTION",
//     PULL = "PULL"
// }

// export enum MessageType {
//     ADD_DOMINO = "ADD_DOMINO",
//     PLAYABLE_DOMINOS = "PLAYABLE_DOMINOS",
//     HAND = "HAND",
//     GAME_OVER = "GAME_OVER",
//     PACK_EMPTY = "PACK_EMPTY",
//     SCORES = "SCORES",
//     ERROR = "ERROR"
// }
interface IProps {}

class App extends React.Component<
    {},
    { socket: any; started: boolean; gameOver: boolean; responseType: string }
> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            socket: null,
            started: false,
            gameOver: false,
            responseType: null
        };
        this.handleStartButtonClick = this.handleStartButtonClick.bind(this);
    }

    componentDidMount() {
        const socket = io("http://localhost:3001");
        socket.on("GAME_START", () => {
            this.setState({ started: true });
        });
        socket.on("GAME_OVER", () => {
            this.setState({ gameOver: true });
        });
        this.setState({ socket: socket });
    }

    handleStartButtonClick() {
        console.log("starting game");
        this.state.socket.emit("GAME_START");
    }

    render() {
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

        const me = new Player("1", "Me", true, 1);
        const opponent1 = new Player("2", "Opponent 1", false, 0);
        const opponent2 = new Player("3", "Opponent 2", false, 3);
        const opponent3 = new Player("4", "Opponent 3", false, 2);

        const gameState = new GameState();
        gameState.AddPlayer(me);
        gameState.AddPlayer(opponent1);
        gameState.AddPlayer(opponent2);
        gameState.AddPlayer(opponent3);

        return (
            <div className="App">
                <GameView gameState={gameState}></GameView>
            </div>
        );
    }
}

export default App;
