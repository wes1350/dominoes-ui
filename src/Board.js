import React from 'react';
import './Board.css';
import Domino from './Domino.js'

class Board extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      domino_faces: [],
      domino_locations: [],
      east_edge: 0,
      west_edge: 0,
      north_edge: 0, 
      south_edge: 0, 
      east_limit: 20,
      west_limit: -20,
      north_limit: 20,
      south_limit: -20,
      original_limit: 20,
      east_offset: 0, 
      north_offset: 0, 
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
                     north_limit: this.state.original_limit,
                     south_limit: -1 * this.state.original_limit,
                     east_edge: 0,
                     west_edge: 0,
                     north_edge: 0, 
                     south_edge: 0, 
                     east_offset: 0, 
                     north_offset: 0, 
      });
      this.setState((state, props) => ({
        domino_size: this.calculate_domino_size(state)
      }));
    })
    this.setState({domino_size: this.calculate_domino_size(this.state)});
  }

  add_domino(desc){
    this.check_board_size(desc["face1loc"], desc["face2loc"]);

    let original_x1 = desc["face1loc"][0];
    let original_y1 = desc["face1loc"][1];
    let original_x2 = desc["face2loc"][0];
    let original_y2 = desc["face2loc"][1];

    this.setState((state, props) => ({
      east_edge: Math.max(state.east_edge, original_x1 + 2, original_x2 + 2),
      west_edge: Math.min(state.west_edge, original_x1, original_x2),
      north_edge: Math.max(state.north_edge, original_y1, original_y2),
      south_edge: Math.min(state.south_edge, original_y1 - 2, original_y2 - 2)
    }));

    let loc1=this.convert_position(desc["face1loc"]);
    let loc2=this.convert_position(desc["face2loc"]);

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
    let east_offset = this.state.east_offset;
    let north_offset = this.state.north_offset;

    let x_start = coords[0] - west + 1 + east_offset;
    let y_start = north - coords[1] + 1 - north_offset;
    let result = [x_start, y_start];
    console.log("Converted ", coords, " to ", result);
    return result;
  }

  calculate_domino_size(state){
    let board_width = state.east_limit - state.west_limit;
    let board_height = state.north_limit - state.south_limit;
    let img_size = state.span * Math.round(state.n_pixels/Math.max(board_width, board_height));
    return img_size
  }

  check_board_size(coords1, coords2){
    const shift_unit = 12;
    let north = this.state.north_limit;
    let south = this.state.south_limit;
    let east = this.state.east_limit;
    let west = this.state.west_limit;
    let north_edge = this.state.north_edge;
    let south_edge = this.state.south_edge;
    let east_edge = this.state.east_edge;
    let west_edge = this.state.west_edge;
    let east_offset = this.state.east_offset;
    let north_offset = this.state.north_offset;

    if (coords1[0] + east_offset < west || coords2[0] + east_offset < west){
      if (east - east_edge >= 8) {
        let offset = Math.floor((east - east_edge) / 4) * 2;
        this.setState((state, props) => ({
          east_edge: state.east_edge + offset,
          west_edge: state.west_edge + offset,
          east_offset: state.east_offset + offset,
          domino_locations: state.domino_locations.map(x => {
            return [[x[0][0] + offset, x[0][1]], 
                    [x[1][0] + offset, x[1][1]]];
          })
        }));
      } else {
        this.setState((state, props) => ({
          west_limit: state.west_limit - shift_unit,
          domino_locations: state.domino_locations.map(x => {
            return [[x[0][0] + shift_unit, x[0][1]], 
                    [x[1][0] + shift_unit, x[1][1]]];
          })
        }));
        this.setState((state, props) => ({
          domino_size: this.calculate_domino_size(state)
        }))
      }
    } else if (coords1[0] + east_offset > east || coords2[0] + east_offset > east){
      if (west - west_edge <= -8) {
        let offset = Math.floor((west - west_edge) / 4) * 2;
        this.setState((state, props) => ({
          west_edge: state.west_edge + offset,
          east_edge: state.east_edge + offset,
          east_offset: state.east_offset + offset,
          domino_locations: state.domino_locations.map(x => {
            return [[x[0][0] + offset, x[0][1]], 
                    [x[1][0] + offset, x[1][1]]];
          })
        }));
      } else {
        this.setState((state, props) => ({
          east_limit: state.east_limit + shift_unit
        }));
        this.setState((state, props) => ({
          domino_size: this.calculate_domino_size(state)
        }));
      }
    } else if (coords1[1] + north_offset > north || coords2[1] + north_offset > north){
      if (south - south_edge <= -8) {
        let offset = Math.floor((south - south_edge) / 4) * 2;
        this.setState((state, props) => ({
          south_edge: state.south_edge + offset,
          north_edge: state.north_edge + offset,
          north_offset: state.north_offset + offset,
          domino_locations: state.domino_locations.map(x => {
            return [[x[0][0], x[0][1] - offset], 
                    [x[1][0], x[1][1] - offset]];
          })
        }));
      } else {
        this.setState((state, props) => ({
          north_limit: state.north_limit + shift_unit,
          domino_locations: state.domino_locations.map(x => {
            return [[x[0][0], x[0][1] + shift_unit], 
                    [x[1][0], x[1][1] + shift_unit]];
          })
        }));
        this.setState((state, props) => ({
          domino_size: this.calculate_domino_size(state)
        }))
      }
    } else if (coords1[1] + north_offset < south || coords2[1] + north_offset < south){
      if (north - north_edge >= 8) {
        let offset = Math.floor((north - north_edge) / 4) * 2;
        this.setState((state, props) => ({
          north_edge: state.north_edge + offset,
          south_edge: state.south_edge + offset,
          north_offset: state.north_offset + offset,
          domino_locations: state.domino_locations.map(x => {
            return [[x[0][0], x[0][1] - offset], 
                    [x[1][0], x[1][1] - offset]];
          })
        }));
      } else {
        this.setState((state, props) => ({
          south_limit: state.south_limit - shift_unit
        }));
        this.setState((state, props) => ({
          domino_size: this.calculate_domino_size(state)
        }))
      }
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
    let board_height = this.state.north_limit - this.state.south_limit;
    let max_dimension = Math.max(board_width, board_height);
    let square_size = Math.round(this.state.n_pixels/max_dimension);
    return <div className="domino-board" 
                style={{ gridTemplateColumns: "repeat(" + max_dimension + ", " + square_size + "px)", 
                         gridTemplateRows: "repeat(" + max_dimension + ", " + square_size + "px)"}}>
  
      {domino_info.map((d, index) => {
              let y1 = d["locations"][0][1];
              let y2 = d["locations"][1][1];
              return (<Domino
              face1={d["faces"][0]} face2={d["faces"][1]}
              x1={d["locations"][0][0]}
              y1={y1}
              x2={d["locations"][1][0]}
              y2={y2}
              rotate={y1 === y2}
              span={this.state.span}
              size={this.state.domino_size}
              key={index} />
      )})}
    </div>
  }
}

export default Board;
