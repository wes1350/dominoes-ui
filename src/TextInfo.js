import React from 'react';
import './App.css';

class TextInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {promptMsg: '', errorMsg: ''};
  }

  componentDidMount(){
    this.props.socket.on('DOMINO', (desc) => {
      this.setState({promptMsg: desc});
      this.props.setResponseType("DOMINO")
    })
    this.props.socket.on('DIRECTION', (desc) => {
      this.setState({promptMsg: desc});
      this.props.setResponseType("DIRECTION")
    })
    this.props.socket.on('PULL', (desc) => {
      this.setState({promptMsg: desc});
      this.props.setResponseType("PULL")
    })
    this.props.socket.on('ERROR', (desc) => {
      this.setState({errorMsg: desc});
    })
  }

  render() {
    return (
      <div style={this.props.style}>
        <p>{this.state.promptMsg}</p>
        <p style={{color: "red"}}>{this.state.errorMsg}</p>
      </div>
    );
  } 
}

export default TextInfo;
