import React, { useState } from "react";
import "./Hand.css";
import { Domino } from "./Domino";

interface IProps {
    style: any;
    faces: any[];
}

export const Hand = (props: IProps) => {
    // // this.state = { domino_faces: [], playable_dominos: [] };
    // const [faces, setFaces] = useState([]);
    // const [playable, setPlayable] = useState([]);

    // componentDidMount() {
    //     this.props.socket.on("HAND", (desc) => {
    //         this.update_hand(desc);
    //     });
    //     this.props.socket.on("PLAYABLE_DOMINOS", (desc) => {
    //         console.log(desc);
    //         this.setState({ playable_dominos: JSON.parse(desc) });
    //     });
    // }

    // update_hand(desc) {
    //     let faces = [];
    //     let i;
    //     for (i = 0; i < desc.length; i++) {
    //         faces.push([desc[i][0], desc[i][1]]);
    //     }
    //     this.setState({ domino_faces: faces });
    // }

    return (
        <div style={props.style}>
            <div className="player-hand">
                {/* {this.state.dominos}
                {props.faces.map((dom, i) => {
                    return (
                        <Domino
                            face1={dom[0]}
                            face2={dom[1]}
                            // x1={1 + i}
                            // y1={1}
                            // x2={1 + i}
                            // y2={2}
                            // span={1}
                            // size={50}
                            // opacity={
                            //     1
                            //     // this.state.playable_dominos?.includes(i)
                            //     //     ? 1
                            //     //     : 0.5
                            // }
                            // key={i}
                        />
                    );
                })} */}
            </div>
        </div>
    );
};
