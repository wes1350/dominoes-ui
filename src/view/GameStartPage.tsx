import React from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { GameConfigDescription } from "interfaces/GameConfigDescription";
import { MessageType } from "enums/MessageType";
import "./GameStartPage.css";
import { useHistory } from "react-router-dom";

interface IProps {
    roomId: string;
    socket: any;
}

export const GameStartPage = observer((props: IProps) => {
    const localStore = useLocalObservable(() => ({
        handSize: "7",
        check5Doubles: "Yes",
        winThreshold: "150"
    }));

    const onSubmit = (e: any) => {
        e.preventDefault();
        const config = {
            HandSize: parseInt(localStore.handSize),
            WinThreshold: parseInt(localStore.winThreshold),
            Check_5_Doubles: localStore.check5Doubles === "Yes"
        } as GameConfigDescription;
        console.log(config);
        props.socket?.emit(MessageType.GAME_START, props.roomId, config);
    };

    const onChangeHandSize = (e: any) => {
        localStore.handSize = e.currentTarget.value;
    };

    const onChangeWinThreshold = (e: any) => {
        localStore.winThreshold = e.target.value;
    };
    const onChange5DoublesSetting = (e: any) => {
        localStore.check5Doubles = e.currentTarget.checked;
    };

    const history = useHistory();

    const onLeaveRoom = () => {
        props.socket.emit(MessageType.LEAVE_ROOM, props.roomId, {
            name: "username"
        });
        history.push("/");
    };

    return (
        <div className="game-start-page">
            <div className="leave-room-button-container">
                <button onClick={onLeaveRoom}>Leave Room</button>
            </div>
            <div className={"game-start-form"}>
                <form onSubmit={onSubmit}>
                    <div className={"game-config-dropdown-container"}>
                        <label>
                            Hand size:
                            <select
                                value={localStore.handSize}
                                onChange={onChangeHandSize}
                            >
                                <option value="5">5</option>
                                <option value="7">7</option>
                                <option value="9">9</option>
                            </select>
                        </label>
                    </div>
                    <div className={"game-config-dropdown-container"}>
                        <label>
                            Win threshold:
                            <select
                                value={localStore.winThreshold}
                                onChange={onChangeWinThreshold}
                            >
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="150">150</option>
                                <option value="200">200</option>
                                <option value="250">250</option>
                            </select>
                        </label>
                    </div>
                    <div className={"game-config-dropdown-container"}>
                        <label>
                            Disallow 5 doubles:
                            <select
                                value={localStore.check5Doubles}
                                onChange={onChange5DoublesSetting}
                            >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </label>
                    </div>
                    <div className={"game-config-submit-button"}>
                        <button type="submit">Start Game</button>
                    </div>
                </form>
            </div>
        </div>
    );
});
