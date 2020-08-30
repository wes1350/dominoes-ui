import React from 'react';
import './Hand.css';
import Domino from './Domino.js'

class Hand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {dominos: []};
  }

  componentDidMount(){
    this.props.socket.on('hand', (desc) => {
      this.update_hand(desc);
      // this.update_hand(JSON.parse(desc));
    })
  }
  
  update_hand(desc){
    let dominos = [];
    let i;
    for (i = 0; i < desc.length; i++){
      dominos.push(
        <Domino face1={desc[i][0]} face2={desc[i][1]} 
                // loc1={{gridRow: "1/3", gridColumn: (1 + 2*i) + "/" + (3 + 2*i), height: "50px", width: "50px"}} 
                // loc2={{gridRow: "3/5", gridColumn: (1 + 2*i) + "/" + (3 + 2*i), height: "50px", width: "50px"}}
                x1={1 + i} y1={1}
                x2={1 + i} y2={2}
                span={1}
                size={50}
                key={i} />
      );
    }
    this.setState({dominos: dominos});
  }

  render() {
    return <div className="player-hand">
      <>
        {this.state.dominos}
      </>
    </div>
  } 
}

export default Hand;
