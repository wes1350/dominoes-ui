import React from "react";
import { Player } from "./Player";
import "./PlayerView.css";

interface IProps {
    index: number;
    player: Player;
}

export const OpponentPlayerView = (props: IProps) => {
    return (
        <div className={`player-view opponent opponent-${props.index}`}>
            <div className={`player-name player-name-${props.index}`}>
                {props.player.Name}
            </div>
            <div className={`player-score player-score-${props.index}`}>
                Score: {props.player.Score}
            </div>
        </div>
    );
};
