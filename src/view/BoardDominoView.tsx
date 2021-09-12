import { Direction } from "enums/Direction";
import { DragItemTypes } from "enums/DragItemTypes";
import { observer } from "mobx-react-lite";
import React from "react";
import { useDrop } from "react-dnd";
import "./DominoView.css";

interface IProps {
    north: number;
    east: number;
    south: number;
    west: number;
    children: any;
    onDropDomino: (item: { index: number }) => void;
}

export const BoardDominoView = observer((props: IProps) => {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: DragItemTypes.DOMINO,
        drop: (item: { index: number }, monitor) => {
            props.onDropDomino(item);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: true
            // isDragging: (monitor as any).internalMonitor.isDragging()
        })
    }));

    return (
        <div
            ref={drop}
            style={{
                gridArea: `${props.north} / ${props.west} / ${props.south} / ${props.east}`
            }}
        >
            {props.children}
        </div>
    );
});
