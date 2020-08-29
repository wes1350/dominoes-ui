import React from 'react';
import Face from './Face.js'

class Domino extends React.Component {
  isDouble() {
    return this.props.face1 === this.props.face2;
  }

  render(){
    if (this.props.reversed){
      return [<Face num={this.props.face1} style={this.props.loc1} key="1" />, 
              <Face num={this.props.face2} style={this.props.loc2} key="2" />]
    } else {
      return [<Face num={this.props.face2} style={this.props.loc2} key="1" />, 
              <Face num={this.props.face1} style={this.props.loc1} key="2" />]
    }
  }
}

export default Domino;