import { observer } from "mobx-react-lite";
import React from "react";
import "./DominoView.css";

interface IProps {
    north: number;
    east: number;
    south: number;
    west: number;
    children: any;
}

export const BoardDominoView = observer((props: IProps) => {
    return (
        <div
            style={{
                gridArea: `${props.north} / ${props.west} / ${props.south} / ${props.east}`
            }}
        >
            {props.children}
        </div>
    );
});
