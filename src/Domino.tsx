import React from "react";
import { Face } from "./Face";
import "./Domino.css";
import { Direction } from "./Direction";

interface IProps {
    face1: number;
    face2: number;
    direction: Direction;
    // size: number;
    // x1: number;
    // x2: number;
    // y1: number;
    // y2: number;
    // opacity: number;
    // span: number;
    // rotate?: boolean;
    // reversed?: boolean;
}

export const Domino = (props: IProps) => {
    // const isDouble = () => {
    //     return props.face1 === props.face2;
    // };

    // let size = { width: props.size + "px", height: props.size + "px" };
    // let style1 = {
    //     ...size,
    //     gridColumn: props.x1 + "/" + (props.x1 + props.span),
    //     gridRow: props.y1 + "/" + (props.y1 + props.span),
    //     opacity: props.opacity,
    //     transform: "rotate(" + (props.rotate ? 9 : "") + "0deg)"
    // }; /*,
    //                        border: "3px solid #66CC33"};*/
    // let style2 = {
    //     ...size,
    //     gridColumn: props.x2 + "/" + (props.x2 + props.span),
    //     gridRow: props.y2 + "/" + (props.y2 + props.span),
    //     opacity: props.opacity,
    //     transform: "rotate(" + (props.rotate ? 9 : "") + "0deg)"
    // }; /*,
    //                        border: "3px solid #66CC33"};*/

    let flexDirection: "row" | "column" | "column-reverse" | "row-reverse",
        borders1: number[],
        borders2: number[];
    switch (props.direction) {
        case Direction.NORTH:
            flexDirection = "column-reverse";
            borders1 = [0, 0, 10, 10];
            borders2 = [10, 10, 0, 0];
            break;
        case Direction.EAST:
            flexDirection = "row";
            borders1 = [10, 0, 0, 10];
            borders2 = [0, 10, 10, 0];
            break;
        case Direction.SOUTH:
            flexDirection = "column";
            borders1 = [10, 10, 0, 0];
            borders2 = [0, 0, 10, 10];
            break;
        case Direction.WEST:
            flexDirection = "row-reverse";
            borders1 = [0, 10, 10, 0];
            borders2 = [10, 0, 0, 10];
            break;
        default:
            flexDirection = "row";
            borders1 = [10, 0, 0, 10];
            borders2 = [0, 10, 10, 0];
    }

    return (
        <div
            className={"domino-outer-container"}
            style={{ flexDirection: flexDirection }}
        >
            <div
                className={"domino-container"}
                style={{
                    borderRadius: borders1.join("px ") + "px"
                }}
            >
                <Face num={props.face1} />
            </div>
            <div
                className={"domino-container"}
                style={{
                    borderRadius: borders2.join("px ") + "px"
                }}
            >
                <Face num={props.face2} />
            </div>
        </div>
    );
};
