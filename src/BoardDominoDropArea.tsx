import React from "react";
import { useDrop } from "react-dnd";
import "./Domino.css";
import { DragItemTypes } from "./Enums";

interface IProps {
    north: number;
    east: number;
    south: number;
    west: number;
    isHighlighted: boolean;
}

export const BoardDominoDropArea = (props: IProps) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: DragItemTypes.DOMINO,
        // drop: () => moveKnight(x, y),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }));
    return (
        <div
            style={{
                gridArea: `${props.north} / ${props.west} / ${props.south} / ${props.east}`,
                border: props.isHighlighted ? "2px solid red" : undefined
            }}
        ></div>
    );
};
