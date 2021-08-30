import React from "react";
import { useDrop } from "react-dnd";
import "./Domino.css";
import { Direction } from "enums/Direction";
import { DragItemTypes } from "enums/DragItemTypes";

interface IProps {
    north: number;
    east: number;
    south: number;
    west: number;
    isActive: boolean;
    boardDirection: Direction;
    onDropDomino: (
        item: { face1: number; face2: number },
        direction: Direction
    ) => void;
}

export const BoardDominoDropArea = (props: IProps) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: DragItemTypes.DOMINO,
        drop: (item: { face1: number; face2: number }, monitor) =>
            props.onDropDomino(item, props.boardDirection),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: true
        })
    }));

    return (
        props.isActive && (
            <div
                ref={drop}
                style={{
                    gridArea: `${props.north} / ${props.west} / ${props.south} / ${props.east}`,
                    border: canDrop ? "2px solid red" : undefined
                }}
            ></div>
        )
    );
};
