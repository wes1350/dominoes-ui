import React from "react";
import { useDrop } from "react-dnd";
import "./Domino.css";
import { DragItemTypes } from "./Enums";

interface IProps {
    north: number;
    east: number;
    south: number;
    west: number;
    children: any;
}

export const BoardDomino = (props: IProps) => {
    return (
        <div
            style={{
                gridArea: `${props.north} / ${props.west} / ${props.south} / ${props.east}`
            }}
        >
            {props.children}
        </div>
    );
};
