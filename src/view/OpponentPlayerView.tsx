import React, { useRef } from "react";
import { OpponentHandDominoView } from "./OpponentHandDominoView";
import { action, runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { IPlayer } from "model/PlayerModel";
import "./PlayerView.css";

interface IProps {
    index: number;
    player: IPlayer;
    current: boolean;
}

export const OpponentPlayerView = observer((props: IProps) => {
    const handRef = useRef<HTMLDivElement>(null);

    const localStore = useLocalObservable(() => ({
        handHeight: window.innerHeight * 0.1
    }));

    React.useEffect(() => {
        const handHeight = handRef?.current?.clientHeight;

        if (!localStore.handHeight) {
            runInAction(() => {
                localStore.handHeight = handHeight;
            });
        }

        const handleWindowResizeForDomino = action(() => {
            localStore.handHeight = handRef?.current?.clientHeight;
        });

        window.addEventListener("resize", handleWindowResizeForDomino);
    });

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
            <div
                ref={handRef}
                className={`hand-container hand-container-${
                    props.index === 1 ? "horizontal" : "vertical"
                }`}
            >
                <div className="hand-wrapper">
                    {props.player.Hand.map((domino, i) => {
                        return (
                            <div key={i} className={"hand-domino-container"}>
                                <OpponentHandDominoView
                                    playerIndex={props.index}
                                    height={localStore.handHeight}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={`player-details player-details-${props.index}`}>
                <div className={`player-name player-name-${props.index}`}>
                    {props.player.Name}
                </div>
                <div className={`player-score player-score-${props.index}`}>
                    Score: {props.player.Score}
                </div>
            </div>
        </div>
    );
});
