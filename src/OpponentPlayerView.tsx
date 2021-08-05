import React from "react";
import { Player } from "./Player";

interface IProps {
    index: number;
    player: Player;
}

export const OpponentPlayerView = (props: IProps) => {
    return <div className={`player-view opponent-${props.index}`}></div>;
};
