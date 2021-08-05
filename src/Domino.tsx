import React from "react";
import { Face } from "./Face";
import "./Domino.css";
import { Direction } from "./Direction";

interface IProps {
    face1?: number;
    face2?: number;
    direction: Direction;
    size?: number;
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
    const hidden = !props.face1 && !props.face2;
    if (!hidden && !(props.face1 && props.face2)) {
        console.error("Only one face supplied, returning null domino");
        return null;
    }

    let flexDirection: "row" | "column" | "column-reverse" | "row-reverse";
    let borders1: number[], borders2: number[];
    let blankBorder1: string, blankBorder2: string; // for hiding middle borders

    const bottomRounded = [0, 0, 12, 12];
    const topRounded = [12, 12, 0, 0];
    const leftRounded = [12, 0, 0, 12];
    const rightRounded = [0, 12, 12, 0];
    switch (props.direction) {
        case Direction.NORTH:
            flexDirection = "column-reverse";
            borders1 = bottomRounded;
            borders2 = topRounded;
            if (hidden) {
                blankBorder1 = "border-top-width";
                blankBorder2 = "border-bottom-width";
            }
            break;
        case Direction.EAST:
            flexDirection = "row";
            borders1 = leftRounded;
            borders2 = rightRounded;
            if (hidden) {
                blankBorder1 = "border-right-width";
                blankBorder2 = "border-left-width";
            }
            break;
        case Direction.SOUTH:
            flexDirection = "column";
            borders1 = topRounded;
            borders2 = bottomRounded;
            if (hidden) {
                blankBorder1 = "border-bottom-width";
                blankBorder2 = "border-top-width";
            }
            break;
        case Direction.WEST:
            flexDirection = "row-reverse";
            borders1 = rightRounded;
            borders2 = leftRounded;
            if (hidden) {
                blankBorder1 = "border-left-width";
                blankBorder2 = "border-right-width";
            }
            break;
        default:
            flexDirection = "row";
            borders1 = leftRounded;
            borders2 = rightRounded;
            if (hidden) {
                blankBorder1 = "border-right-width";
                blankBorder2 = "border-left-width";
            }
    }

    const style1: any = {
        borderRadius: borders1.join("px ") + "px"
    };
    const style2: any = {
        borderRadius: borders2.join("px ") + "px"
    };

    if (blankBorder1 && blankBorder2) {
        style1[blankBorder1] = "0px";
        style2[blankBorder2] = "0px";
    }

    return (
        <div
            className={"domino-outer-container"}
            style={{ flexDirection: flexDirection }}
        >
            <div className={"domino-container"} style={style1}>
                <Face num={props.face1} size={props.size ?? 96} />
            </div>
            <div className={"domino-container"} style={style2}>
                <Face num={props.face2} size={props.size ?? 96} />
            </div>
        </div>
    );
};
