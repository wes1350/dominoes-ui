import React from 'react';
import Board from './Board.js'
import TextInfo from './TextInfo.js'
import MoveInput from './MoveInput.js'
import './App.css';
const socketIOClient = require("socket.io-client")

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      started: false
    }; 
    this.boardRef = React.createRef();
    this.handleStartButtonClick = this.handleStartButtonClick.bind(this);
  }

  componentDidMount() {
    this.setState({socket: socketIOClient("http://localhost:5000/")})
  }

  handleStartButtonClick() {
    this.setState({started: true});
    this.state.socket.emit("start_game");
  }

  render(){
    const started = this.state.started;
    let content;
  
    if (started) {
        content = (
          <>
            <p>Dominos!</p>
            <Board ref={this.boardRef} socket={this.state.socket} />
            <TextInfo socket={this.state.socket} />
            <MoveInput socket={this.state.socket} />
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
