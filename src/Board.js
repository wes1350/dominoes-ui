import React from 'react';
import './Board.css';
import Domino from './Domino.js'

class Board extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      dominos: [],
      east_limit: 20,
      west_limit: -20,
      north_limit: 20,
      n_pixels: 720
    };
  }

  componentDidMount(){
    this.props.socket.on('add_domino', (desc) => {
      console.log('domino:', desc);
      this.add_domino(JSON.parse(desc));
    })
    this.props.socket.on('clear_board', (desc) => {
      this.setState({dominos: []});
    })
  }

  add_domino(desc){
    let dominos = this.state.dominos;
    this.check_board_size(desc["face1loc"], desc["face2loc"]);

    let loc1=this.convert_position(desc["face1loc"]);
    let loc2=this.convert_position(desc["face2loc"]);
    console.log(loc1)
    console.log(loc2)

    dominos.push(
      <Domino face1={desc["face1"]} face2={desc["face2"]} 
              x1={loc1[0]} y1={loc1[1]}
              x2={loc2[0]} y2={loc2[1]}
              span={2}
              size={this.calculate_domino_size()}
              key={this.state.dominos.length} />
    );
    this.setState({dominos: dominos});
  }

  convert_position(coords){
    let west = this.state.west_limit;
    let north = this.state.north_limit;

    let x_start = coords[0] - west  + 1
    let y_start = north - coords[1] + 1
    // let result = {
    //   gridRow: y_start + "/" + (y_start + 2), 
    //   gridColumn: x_start + "/" + (x_start + 2)
    // }
    let result = [x_start, y_start];
    console.log(" Converted ", coords, " to ", result);
    return result;
  }

  calculate_domino_size(){
    let board_width = this.state.east_limit - this.state.west_limit;
    let img_size = 2 * Math.round(this.state.n_pixels/board_width);
    return img_size
  }

  check_board_size(coords1, coords2){
    let north = this.state.north_limit;
    let east = this.state.east_limit;
    let west = this.state.west_limit;
    if (coords1[0] < west || coords2[0] < west){
      this.setState({west_limit: west - 12});
    } else if (coords1[0] > east || coords2[0] > east){
      this.setState({east_limit: east + 12});
    } else if (coords1[1] > north || coords2[1] > north){
      this.setState({north_limit: north + 12});
    }
  }

  render(){
    let board_width = this.state.east_limit - this.state.west_limit;
    let square_size = Math.round(this.state.n_pixels/board_width);
    console.log("Board style: " + board_width + ", " + square_size)
    return <div className="domino-board" 
                style={{ gridTemplateColumns: "repeat(" + board_width + ", " + square_size + "px)", gridAutoRows: square_size + "px"}}>
  
      {this.state.dominos}
    </div>
  }
}

export default Board;
