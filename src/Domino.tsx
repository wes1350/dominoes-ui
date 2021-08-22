import React from "react";
import { Face } from "./Face";
import "./Domino.css";
import { isNullOrUndefined } from "./utils";
import { Direction, DragItemTypes } from "./Enums";
import { useDrag } from "react-dnd";

interface IProps {
    face1?: number;
    face2?: number;
    direction: Direction;
    size?: number;
    faded?: boolean;
    draggable?: boolean;
}

export const Domino = (props: IProps) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: DragItemTypes.DOMINO,
        item: { face1: props.face1, face2: props.face2 },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }));

    const hidden =
        isNullOrUndefined(props.face1) && isNullOrUndefined(props.face2);
    if (
        !hidden &&
        (isNullOrUndefined(props.face1) || isNullOrUndefined(props.face2))
    ) {
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
            ref={props.draggable ? drag : null}
            style={{
                flexDirection: flexDirection,
                opacity: props.faded || isDragging ? 0.5 : 1
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
};
