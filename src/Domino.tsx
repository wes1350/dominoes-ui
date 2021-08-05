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
    let borderRadii1: (number | string)[], borderRadii2: (number | string)[];
    let blankBorder1: string, blankBorder2: string; // for hiding middle borders

    const roundedBorderRadius = "12.5%";
    const bottomRounded = [0, 0, roundedBorderRadius, roundedBorderRadius];
    const topRounded = [roundedBorderRadius, roundedBorderRadius, 0, 0];
    const leftRounded = [roundedBorderRadius, 0, 0, roundedBorderRadius];
    const rightRounded = [0, roundedBorderRadius, roundedBorderRadius, 0];
    switch (props.direction) {
        case Direction.NORTH:
            flexDirection = "column-reverse";
            borderRadii1 = bottomRounded;
            borderRadii2 = topRounded;
            if (hidden) {
                blankBorder1 = "border-top-width";
                blankBorder2 = "border-bottom-width";
            }
            break;
        case Direction.EAST:
            flexDirection = "row";
            borderRadii1 = leftRounded;
            borderRadii2 = rightRounded;
            if (hidden) {
                blankBorder1 = "borderRightWidth";
                blankBorder2 = "borderLeftWidth";
            }
            break;
        case Direction.SOUTH:
            flexDirection = "column";
            borderRadii1 = topRounded;
            borderRadii2 = bottomRounded;
            if (hidden) {
                blankBorder1 = "borderBottomWidth";
                blankBorder2 = "borderTopWidth";
            }
            break;
        case Direction.WEST:
            flexDirection = "row-reverse";
            borderRadii1 = rightRounded;
            borderRadii2 = leftRounded;
            if (hidden) {
                blankBorder1 = "borderLeftWidth";
                blankBorder2 = "borderRightWidth";
            }
            break;
        default:
            flexDirection = "row";
            borderRadii1 = leftRounded;
            borderRadii2 = rightRounded;
            if (hidden) {
                blankBorder1 = "borderRightWidth";
                blankBorder2 = "borderLeftWidth";
            }
    }

    const style1: any = {
        borderRadius: borderRadii1.join(" ")
    };
    const style2: any = {
        borderRadius: borderRadii2.join(" ")
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
