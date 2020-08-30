import React from 'react';
import Face from './Face.js'

class Domino extends React.Component {
  isDouble() {
    return this.props.face1 === this.props.face2;
  }

  render(){
    let size = {width: this.props.size + "px", height: this.props.size + "px"};
    let style1 = {...size, gridColumn: this.props.x1 + "/" + (this.props.x1 + this.props.span),
                           gridRow: this.props.y1 + "/" + (this.props.y1 + this.props.span)};
    let style2 = {...size, gridColumn: this.props.x2 + "/" + (this.props.x2 + this.props.span),
                           gridRow: this.props.y2 + "/" + (this.props.y2 + this.props.span)};

    if (this.props.reversed){
      return [<Face num={this.props.face1} style={style1} key="1" />, 
              <Face num={this.props.face2} style={style2} key="2" />]
    } else {
      return [<Face num={this.props.face2} style={style2} key="1" />, 
              <Face num={this.props.face1} style={style1} key="2" />]
    }
  }
}

export default Domino;
