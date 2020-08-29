import React from 'react';
import './App.css';

class TextInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {promptMsg: '', errorMsg: ''};
  }

  componentDidMount(){
    this.props.socket.on('prompt', (desc) => {
      this.setState({promptMsg: desc});
    })
    this.props.socket.on('error', (desc) => {
      this.setState({errorMsg: desc});
    })
  }

  render() {
    return (
      <>
        <p>{this.state.promptMsg}</p>
        <p style={{color: "red"}}>{this.state.errorMsg}</p>
      </>
    );
  } 
}

export default TextInfo;
