import React from 'react';
import './Board.css';
import Domino from './Domino.js'

class Board extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      domino_faces: [],
      domino_locations: [],
      east_limit: 20,
      west_limit: -20,
      north_limit: 20,
      original_limit: 20,
      n_pixels: 720,
      span: 2,
      domino_size: 100 // default is always overridden
    };
  }

  componentDidMount(){
    this.props.socket.on('add_domino', (desc) => {
      console.log('domino:', desc);
      this.add_domino(JSON.parse(desc));
    })
    this.props.socket.on('clear_board', (desc) => {
      this.setState({domino_faces: [], domino_locations: [],
                     east_limit: this.state.original_limit,
                     west_limit: -1 * this.state.original_limit,
                     north_limit: this.state.original_limit
      });
      this.setState((state, props) => ({
        domino_size: this.calculate_domino_size(state)
      }));
    })
    this.setState({domino_size: this.calculate_domino_size(this.state)});
  }

  add_domino(desc){
    this.check_board_size(desc["face1loc"], desc["face2loc"]);

    let loc1=this.convert_position(desc["face1loc"]);
    let loc2=this.convert_position(desc["face2loc"]);
    console.log(loc1)
    console.log(loc2)

    let locations = [[loc1[0], loc1[1]], [loc2[0], loc2[1]]];
    this.setState((state, props) => ({
      domino_locations: [...state.domino_locations, locations],
      domino_faces: [...state.domino_faces, [desc["face1"], desc["face2"]]]
    }));
    console.log(this.state.domino_locations.length)
  }

  convert_position(coords){
    let west = this.state.west_limit;
    let north = this.state.north_limit;

    let x_start = coords[0] - west  + 1
    let y_start = north - coords[1] + 1
    let result = [x_start, y_start];
    console.log("Converted ", coords, " to ", result);
    return result;
  }

  calculate_domino_size(state){
    let board_width = state.east_limit - state.west_limit;
    let img_size = state.span * Math.round(state.n_pixels/board_width);
    return img_size
  }

  check_board_size(coords1, coords2){
    const shift_unit = 12;
    let north = this.state.north_limit;
    let east = this.state.east_limit;
    let west = this.state.west_limit;
    if (coords1[0] < west || coords2[0] < west){
      this.setState((state, props) => ({
        west_limit: state.west_limit - shift_unit,
        domino_locations: state.domino_locations.map(x => {
          return [[x[0][0] + shift_unit, x[0][1]], 
                  [x[1][0] + shift_unit, x[1][1]]];
        })
      }));
      this.setState((state, props) => ({
        domino_size: this.calculate_domino_size(state)
      }));
      console.log("Updated domino board dimensions");
      console.log("New west: ", this.state.west_limit);
    } else if (coords1[0] > east || coords2[0] > east){
      this.setState((state, props) => ({
        east_limit: state.east_limit + shift_unit
      }));
      this.setState((state, props) => ({
        domino_size: this.calculate_domino_size(state)
      }));
    } else if (coords1[1] > north || coords2[1] > north){
      this.setState((state, props) => ({
        north_limit: state.north_limit + shift_unit,
        domino_locations: state.domino_locations.map(x => {
          return [[x[0][0], x[0][1] + shift_unit], 
                  [x[1][0], x[1][1] + shift_unit]];
        })
      }));
      console.log("Updated domino board dimensions");
      console.log("New north: ", this.state.north_limit);
    }
  }

  render(){
    let domino_info = [];
    let i;
    for (i = 0; i < this.state.domino_faces.length; i++){
      domino_info.push({"faces": this.state.domino_faces[i],
                        "locations": this.state.domino_locations[i]
                       });
    }
    let board_width = this.state.east_limit - this.state.west_limit;
    let square_size = Math.round(this.state.n_pixels/board_width);
    console.log("Board style: " + board_width + ", " + square_size)
    return <div className="domino-board" 
                style={{ gridTemplateColumns: "repeat(" + board_width + ", " + square_size + "px)", gridAutoRows: square_size + "px"}}>
  
      {domino_info.map((d, index) => {
              return (<Domino 
              face1={d["faces"][0]} face2={d["faces"][1]} 
              x1={d["locations"][0][0]} 
              y1={d["locations"][0][1]}
              x2={d["locations"][1][0]} 
              y2={d["locations"][1][1]}
              span={this.state.span}
              size={this.state.domino_size}
              key={index} />
      )})}
    </div>
  }
}

export default Board;
