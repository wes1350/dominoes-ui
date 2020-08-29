import React from 'react';
import Domino from './Domino.js'

class Board extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dominos: []
    }
  }

  componentDidMount(){
    this.props.socket.on('add_domino', (desc) => {
      console.log('domino:', desc);
      this.add_domino(JSON.parse(desc));
    })
  }

  add_domino(desc){
    let dominos = this.state.dominos;
    dominos.push(
      <Domino face1={desc["face1"]} face2={desc["face2"]} 
              loc1={this.convert_position(desc["face1loc"])} loc2={this.convert_position(desc["face2loc"])}
              key={this.state.dominos.length} />
    );
    this.setState({dominos: dominos});
  }

  convert_position(coords){
    console.log(coords);
    let x_start = 17 - coords[1]
    let y_start = coords[0] + 17
    let result = {gridRow: x_start + "/" + (x_start + 2), 
            gridColumn: y_start + "/" + (y_start + 2)}
    console.log(" Converted ", coords, " to ", result);
    return result;

  }

  render(){
    return <div className="domino-board">
      {
      //<Domino face1={2} face2={0} reversed={false} loc1={{gridRow:"1", gridColumn:"1"}} loc2={{gridRow:"1", gridColumn:"2"}} />
      //<Domino face1={4} face2={1} reversed={true} loc1={{gridRow:"2", gridColumn:"2"}} loc2={{gridRow:"2", gridColumn:"3"}} />
      }
      {this.state.dominos}
    </div>
  }
}

export default Board;
