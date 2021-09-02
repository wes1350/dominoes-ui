import React from "react";
import { useDrop } from "react-dnd";
import { Direction } from "enums/Direction";
import { DragItemTypes } from "enums/DragItemTypes";
import { observer } from "mobx-react-lite";

interface IProps {
    north: number;
    east: number;
    south: number;
    west: number;
    isActive: boolean;
    boardDirection: Direction;
    onDropDomino: (item: { index: number }, direction: Direction) => void;
}

export const BoardDominoDropArea = observer((props: IProps) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: DragItemTypes.DOMINO,
        drop: (item: { index: number }, monitor) =>
            props.onDropDomino(item, props.boardDirection),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: true
            // isDragging: (monitor as any).internalMonitor.isDragging()
        })
    }));

    return (
        props.isActive && (
            <div
                ref={drop}
                style={{
                    gridArea: `${props.north} / ${props.west} / ${props.south} / ${props.east}`,
                    border: canDrop ? "2px solid red" : undefined,
                    borderRadius: "12.5%"
                }}
            ></div>
        )
    );
});
