import React from "react";
import { Face } from "./Face";

interface IProps {}

export const GameView = (props: IProps) => {
    return (
        <div className="game-view">
            <Face num={0} />
            <Face num={1} />
            <Face num={2} />
            <Face num={3} />
            <Face num={4} />
            <Face num={5} />
            <Face num={6} />
        </div>
    );
};
