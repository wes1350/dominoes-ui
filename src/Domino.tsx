import React from "react";
import { Face } from "./Face";

interface IProps {
    face1: number;
    face2: number;
    size: number;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    opacity: number;
    span: number;
    rotate?: boolean;
    reversed?: boolean;
}

export const Domino = (props: IProps) => {
    // const isDouble = () => {
    //     return props.face1 === props.face2;
    // };

    let size = { width: props.size + "px", height: props.size + "px" };
    let style1 = {
        ...size,
        gridColumn: props.x1 + "/" + (props.x1 + props.span),
        gridRow: props.y1 + "/" + (props.y1 + props.span),
        opacity: props.opacity,
        transform: "rotate(" + (props.rotate ? 9 : "") + "0deg)"
    }; /*,
                           border: "3px solid #66CC33"};*/
    let style2 = {
        ...size,
        gridColumn: props.x2 + "/" + (props.x2 + props.span),
        gridRow: props.y2 + "/" + (props.y2 + props.span),
        opacity: props.opacity,
        transform: "rotate(" + (props.rotate ? 9 : "") + "0deg)"
    }; /*,
                           border: "3px solid #66CC33"};*/

    return props.reversed ? (
        <div className={"domino-container"}>
            <Face num={props.face1} style={style1} key="1" />,
            <Face num={props.face2} style={style2} key="2" />
        </div>
    ) : (
        <div className={"domino-container"}>
            <Face num={props.face2} style={style2} key="1" />,
            <Face num={props.face1} style={style1} key="2" />
        </div>
    );
};
