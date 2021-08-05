import React from "react";
import { Direction } from "./Direction";
import { Domino } from "./Domino";
import { Player } from "./Player";
import "./PlayerView.css";

interface IProps {
    index: number;
    player: Player;
}

export const OpponentPlayerView = (props: IProps) => {
    return (
        <div
            className={`player-view player-view-${
                props.index === 1 ? "horizontal" : "vertical"
            } opponent opponent-${props.index}`}
        >
            <div className={`player-name player-name-${props.index}`}>
                {props.player.Name}
            </div>
            <div
                className={`hand-container hand-container-${
                    props.index === 1 ? "horizontal" : "vertical"
                }`}
            >
                {props.player.Hand.map((domino, i) => {
                    return (
                        <div key={i} className={"hand-domino-container"}>
                            <Domino
                                direction={
                                    props.index === 1
                                        ? Direction.SOUTH
                                        : Direction.EAST
                                }
                                size={36}
                            />
                        </div>
                    );
                })}
            </div>
            <div className={`player-score player-score-${props.index}`}>
                Score: {props.player.Score}
            </div>
        </div>
    );
};
