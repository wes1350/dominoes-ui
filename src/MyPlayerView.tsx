import React from "react";
import { Domino } from "./Domino";
import { Direction } from "./Enums";
import { Player } from "./Player";
import "./PlayerView.css";

interface IProps {
    player: Player;
    current: boolean;
}

export const MyPlayerView = (props: IProps) => {
    console.log("props.player:", props.player);
    const playableDominoes = props.player.PlayableDominoes;
    return (
        <div
            className={`player-view player-view-horizontal my-player ${
                props.current ? " current" : ""
            }`}
        >
            <div className={"player-name player-name-me"}>
                {props.player.Name}
            </div>
            <div className={"hand-container hand-container-horizontal"}>
                {props.player.Hand.map((domino, i) => {
                    return (
                        <div key={i} className={"hand-domino-container"}>
                            <Domino
                                face1={domino.face1}
                                face2={domino.face2}
                                direction={Direction.SOUTH}
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
                                faded={
                                    playableDominoes === null
                                        ? false
                                        : !playableDominoes.includes(i)
                                }
                            />
                        </div>
                    );
                })}
            </div>
            <div className={"player-score player-score-me"}>
                Score: {props.player.Score}
            </div>
        </div>
    );
};
