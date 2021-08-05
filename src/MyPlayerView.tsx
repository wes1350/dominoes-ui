import React from "react";
import { Player } from "./Player";

interface IProps {
    player: Player;
}

export const MyPlayerView = (props: IProps) => {
    return <div className={`player-view my-player`}></div>;
};
