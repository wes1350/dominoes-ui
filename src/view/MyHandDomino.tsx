import React from "react";
import "./DominoView.css";
import { DragItemTypes } from "enums/DragItemTypes";
import { useDrag } from "react-dnd";
import { observer } from "mobx-react-lite";

interface IProps {
    index: number;
    face1: number;
    face2: number;
    playable?: boolean;
    children: any;
    onStartDrag: () => void;
    onStopDrag: () => void;
}

export const MyHandDomino = observer((props: IProps) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: DragItemTypes.DOMINO,
        item: () => {
            props.onStartDrag();
            return { index: props.index };
        },
        end: () => {
            props.onStopDrag();
        },
        // Doesn't work, seems it's not detecting props.playable properly
        // canDrag: () => {
        //     console.log("can drag:", props.playable);
        //     return props.playable;
        // },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }));

    return (
        <div
            className={"hand-domino-container"}
            ref={drag}
            style={{
                opacity: !props.playable || isDragging ? 0.5 : 1
            }}
            draggable={props.playable}
        >
            {props.children}
        </div>
    );
});
