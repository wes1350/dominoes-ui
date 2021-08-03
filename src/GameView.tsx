import React from "react";
import { Direction } from "./Direction";
import { Domino } from "./Domino";
import { Face } from "./Face";

interface IProps {}

export const GameView = (props: IProps) => {
    return (
        <div className="game-view">
            <Domino face1={0} face2={6} direction={Direction.NORTH} />
            <Domino face1={1} face2={5} direction={Direction.EAST} />
            <Domino face1={2} face2={4} direction={Direction.SOUTH} />
            <Domino face1={3} face2={3} direction={Direction.WEST} />
        </div>
    );
};
