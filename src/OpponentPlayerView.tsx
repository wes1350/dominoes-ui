import React from "react";
import { Domino } from "./Domino";
import { Direction } from "./Enums";
import { Player } from "./Player";
import "./PlayerView.css";

interface IProps {
    index: number;
    player: Player;
    current: boolean;
}

export const OpponentPlayerView = (props: IProps) => {
    return (
        <div
            className={`player-view player-view-${
                props.index === 1 ? "horizontal" : "vertical"
            } opponent opponent-${props.index} ${
                props.current ? " current" : ""
            }`}
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
                                size={
                                    2 *
                                    Math.floor(
                                        0.5 *
                                            Math.min(
                                                36,
                                                300 / props.player.Hand.length
                                            )
                                    )
                                }
                                faded={false}
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
