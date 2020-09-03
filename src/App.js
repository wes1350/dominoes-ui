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
  
    if (started) {
      content = (
        <>
          <h1>Dominos!</h1> 
          { gameOver && <h3>Game over!</h3>}
          { !gameOver &&
            <div>
            <hr />
            <Board socket={this.state.socket} />
            <hr />
            <Hand socket={this.state.socket} />
            <hr />
            <TextInfo socket={this.state.socket} />
            </div>
          }
          <ScoreInfo socket={this.state.socket} />
          <hr />
          { !gameOver &&
          <MoveInput socket={this.state.socket} />
          }
        </>
      );
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
