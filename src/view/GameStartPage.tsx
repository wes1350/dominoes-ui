import React from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { GameConfigDescription } from "interfaces/ GameConfigDescription";
import { MessageType } from "enums/MessageType";

interface IProps {
    socket: any;
}

export const GameStartPage = observer((props: IProps) => {
    const localStore = useLocalObservable(() => ({
        handSize: 7
    }));

    return (
        <>
            <button
                className={"game-start-button"}
                onClick={() => {
                    const config = {
                        HandSize: localStore.handSize
                    } as GameConfigDescription;
                    console.log(config);
                    props.socket?.emit(MessageType.GAME_START, config);
                }}
            >
                Start
            </button>
            <div>
                <span>hand size:</span>
                <input
                    onChange={(e: React.FormEvent<HTMLInputElement>) => {
                        // handle non-integer values. Even better, use a dropdown or something
                        if (e) {
                            localStore.handSize = parseInt(
                                e.currentTarget.value
                            );
                        }
                    }}
                    defaultValue={localStore.handSize}
                ></input>
            </div>
        </>
    );
});
