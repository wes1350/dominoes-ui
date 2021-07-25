import React from 'react';
import Board from './Board.js'
import TextInfo from './TextInfo.js'
import ScoreInfo from './ScoreInfo.js'
import MoveInput from './MoveInput.js'
import Hand from './Hand.js'
import './App.css';
const socketIOClient = require("socket.io-client")

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      started: false,
      gameOver: false
    }; 
    this.handleStartButtonClick = this.handleStartButtonClick.bind(this);
  }

  componentDidMount() {
    const socket = socketIOClient("http://localhost:5000/");
    socket.on('game_start', (desc) => {
      this.setState({started: true});
    });
    socket.on('game_over', (desc) => {
      this.setState({gameOver: true});
    });
    this.setState({socket: socket});
  }

  handleStartButtonClick() {
    this.state.socket.emit("start_game");
  }

  render(){
    const started = this.state.started;
    const gameOver = this.state.gameOver;
    let content;
    let scoreInfo = <ScoreInfo style={{gridColumn: "1", gridRow: "1"}} socket={this.state.socket} />;
    let gameBoard = <Board style={{gridColumn: "2", gridRow: "1 / 7"}} socket={this.state.socket} />;
  
    if (started) {
      if (gameOver){
        content = (
          <div className="gameover-page">
            <h3>Game over!</h3>
            {scoreInfo}
            {gameBoard}
          </div>
        );
      } else {
      content = (
          <div className="gameplay-page">
            {scoreInfo}
            <TextInfo style={{gridColumn: "1", gridRow: "2 / 4"}} socket={this.state.socket} />
            <Hand style={{gridColumn: "1", gridRow: "4"}} socket={this.state.socket} />
            <MoveInput style={{gridColumn: "1", gridRow: "5"}} socket={this.state.socket} />
            {gameBoard}
          </div>
        );
      }
    } else {
      content = (
        <>
          <p>Dominos!</p>
          <button onClick={this.handleStartButtonClick}>Start Game</button>
        </>
      );
    }
    return <div className="App">{content}</div>
  }
}

export default App;
