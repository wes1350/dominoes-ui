import React from "react";
import { Player } from "./Player";
import "./PlayerView.css";

interface IProps {
    player: Player;
}

export const MyPlayerView = (props: IProps) => {
    return (
        <div className={`player-view my-player`}>
            <div className={"player-name player-name-me"}>
                {props.player.Name}
            </div>
            <div className={"player-score player-score-me"}>
                Score: {props.player.Score}
            </div>
        </div>
    );
};
