import React from "react";
import { Domino } from "./Domino";
import { Direction } from "./Enums";
import { Player } from "./Player";
import "./PlayerView.css";

interface IProps {
    player: Player;
}

export const MyPlayerView = (props: IProps) => {
    console.log("props.player:", props.player);
    const playableDominoes = props.player.PlayableDominoes;
    return (
        <div className={`player-view player-view-horizontal my-player`}>
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
                                size={36}
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
