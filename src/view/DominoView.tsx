import React from "react";
import { Face } from "./Face";
import "./DominoView.css";
import { Direction } from "enums/Direction";
import { observer } from "mobx-react-lite";

interface IProps {
    face1: number;
    face2: number;
    direction: Direction;
    size?: number;
}

export const DominoView = observer((props: IProps) => {
    const isHiddenDomino = props.face1 === -1 || props.face2 === -1;

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
            if (isHiddenDomino) {
                blankBorder1 = "border-top-width";
                blankBorder2 = "border-bottom-width";
            }
            break;
        case Direction.EAST:
            flexDirection = "row";
            borderRadii1 = leftRounded;
            borderRadii2 = rightRounded;
            if (isHiddenDomino) {
                blankBorder1 = "borderRightWidth";
                blankBorder2 = "borderLeftWidth";
            }
            break;
        case Direction.SOUTH:
            flexDirection = "column";
            borderRadii1 = topRounded;
            borderRadii2 = bottomRounded;
            if (isHiddenDomino) {
                blankBorder1 = "borderBottomWidth";
                blankBorder2 = "borderTopWidth";
            }
            break;
        case Direction.WEST:
            flexDirection = "row-reverse";
            borderRadii1 = rightRounded;
            borderRadii2 = leftRounded;
            if (isHiddenDomino) {
                blankBorder1 = "borderLeftWidth";
                blankBorder2 = "borderRightWidth";
            }
            break;
        case Direction.NONE:
            if (props.face1 === props.face2) {
                flexDirection = "column";
                borderRadii1 = topRounded;
                borderRadii2 = bottomRounded;
            } else {
                flexDirection = "row";
                borderRadii1 = leftRounded;
                borderRadii2 = rightRounded;
            }
            break;
        default:
            // should not get here
            flexDirection = "row";
            borderRadii1 = leftRounded;
            borderRadii2 = rightRounded;
            if (isHiddenDomino) {
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
            style={{
                flexDirection: flexDirection
            }}
        >
            <div className={"domino-container"} style={style1}>
                <Face num={props.face1} size={props.size ?? 32} />
            </div>
            <div className={"domino-container"} style={style2}>
                <Face num={props.face2} size={props.size ?? 32} />
            </div>
        </div>
    );
});
