import { Direction } from "enums/Direction";
import { observer } from "mobx-react-lite";
import { IPlayer } from "model/PlayerModel";
import React from "react";
import { DominoView } from "./DominoView";
import { MyHandDomino } from "./MyHandDomino";
import "./PlayerView.css";

interface IProps {
    player: IPlayer;
    current: boolean;
    onStartDrag: (index: number) => void;
    onStopDrag: () => void;
}

export const MyPlayerView = observer((props: IProps) => {
    const playableDominoes = props.player.PlayableDominoes;
    return (
        <div
            className={`player-view player-view-horizontal my-player ${
                props.current ? " current" : ""
            }`}
            style={{ borderBottom: "0px" }}
        >
            <div className={"player-name player-name-me"}>
                {props.player.Name}
            </div>
            <div className={"hand-container hand-container-horizontal"}>
                {props.player.Hand.map((domino, i) => {
                    return (
                        <MyHandDomino
                            key={i}
                            face1={domino.Face1}
                            face2={domino.Face2}
                            faded={
                                playableDominoes === null
                                    ? true
                                    : !playableDominoes.includes(i)
                            }
                            draggable={props.player.PlayableDominoes?.includes(
                                i
                            )}
                            onStartDrag={() => props.onStartDrag(i)}
                            onStopDrag={() => props.onStopDrag()}
                        >
                            <DominoView
                                face1={domino.Face1}
                                face2={domino.Face2}
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
                            />
                        </MyHandDomino>
                    );
                })}
            </div>
            <div className={"player-score player-score-me"}>
                Score: {props.player.Score}
            </div>
        </div>
    );
});
