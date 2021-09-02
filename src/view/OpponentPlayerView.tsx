import { Direction } from "enums/Direction";
import { observer } from "mobx-react-lite";
import { IPlayer } from "model/PlayerModel";
import React from "react";
import { DominoView } from "./DominoView";
import "./PlayerView.css";

interface IProps {
    index: number;
    player: IPlayer;
    current: boolean;
}

export const OpponentPlayerView = observer((props: IProps) => {
    const borderlessProperty =
        props.index === 1
            ? "borderTop"
            : props.index === 2
            ? "borderLeft"
            : "borderRight";
    return (
        <div
            className={`player-view player-view-${
                props.index === 1 ? "horizontal" : "vertical"
            } opponent opponent-${props.index} ${
                props.current ? " current" : ""
            }`}
            style={{ [borderlessProperty]: "0px" }}
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
                            <DominoView
                                face1={-1}
                                face2={-1}
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
});
