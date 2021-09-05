import React from "react";
import { observer } from "mobx-react-lite";
import { GameEvent } from "interfaces/GameEvent";
import "./GameEventRenderer.css";

interface IProps {
    event?: GameEvent;
    index?: number;
    clearEvent: () => void;
}

export const GameEventRenderer = observer((props: IProps) => {
    React.useEffect(() => {
        if (props.event) {
            setTimeout(() => {
                console.log("clearingEvent");
                props.clearEvent();
            }, props.event.Duration);
        }
    });

    const gameEventClass =
        props.index === null
            ? ""
            : props.index === 0
            ? " game-event-me"
            : ` game-event-opponent-${props.index}`;

    return (
        <div className="game-event-renderer">
            {!!props.event && (
                // need to figure out a better way to map seats

                <div className={`game-event${gameEventClass}`}>
                    {props.event.Type}
                </div>
            )}
            {/* {!props.event && <div className={"game-event"}>not rendered</div>} */}
        </div>
    );
});
