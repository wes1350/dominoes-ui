import React from "react";
import "./Domino.css";
import { DragItemTypes } from "./Enums";
import { useDrag } from "react-dnd";

interface IProps {
    face1: number;
    face2: number;
    draggable?: boolean;
    faded?: boolean;
    children: any;
    onStartDrag: () => void;
    onStopDrag: () => void;
}

export const MyHandDomino = (props: IProps) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: DragItemTypes.DOMINO,
        item: () => {
            props.onStartDrag();
            return { face1: props.face1, face2: props.face2 };
        },
        end: (item, monitor) => {
            props.onStopDrag();
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }));

    return (
        <div
            className={"hand-domino-container"}
            ref={props.draggable ? drag : null}
            style={{
                opacity: props.faded || isDragging ? 0.5 : 1
            }}
        >
            {props.children}
        </div>
    );
};
