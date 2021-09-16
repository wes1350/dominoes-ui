import React from "react";
import { observer } from "mobx-react-lite";
import { DominoView } from "./DominoView";
import { Direction } from "enums/Direction";

interface IProps {
    playerIndex: number;
    height: number;
}

export const OpponentHandDominoView = observer((props: IProps) => {
    if (!props.height) {
        return null;
    }

    const margin = 3;
    return (
        <div
            className={"hand-domino-container"}
            style={{
                margin: `${margin}px`,
                height: props.height - 2 * margin,
                width: 0.5 * props.height - margin
            }}
        >
            <DominoView
                face1={-1}
                face2={-1}
                direction={
                    props.playerIndex === 1 ? Direction.SOUTH : Direction.EAST
                }
            />
        </div>
    );
});
