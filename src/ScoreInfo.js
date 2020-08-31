import React from 'react';
import './App.css';

class TextInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {scores: {}};
  }

  componentDidMount(){
    this.props.socket.on('scores', (desc) => {
      this.setState({scores: desc});
    })
  }

  render() {
    let i;
    let scores = this.state.scores;
    let score_displays = [];
    for (i = 0; i < Object.keys(this.state.scores).length; i++){
      score_displays.push(
        <p key={i}>Player {i} score: {scores["" + i]}</p>
      );
    }
    return (
      <>
        {score_displays}
      </>
    );
  } 
}

export default TextInfo;
