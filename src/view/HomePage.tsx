import React from "react";
import { NavBar } from "./NavBar";
import { useHistory } from "react-router-dom";
import { MessageType } from "enums/MessageType";
import { WebUtils } from "utils/WebUtils";
import { observer, useLocalObservable } from "mobx-react-lite";
import { runInAction } from "mobx";
import "./HomePage.css";

interface IProps {
    socket: any;
}
export const HomePage = observer((props: IProps) => {
    const ROOM_REFRESH_INTERVAL = 3000;
    const localStore = useLocalObservable(() => ({
        rooms: []
    }));

    const history = useHistory();

    const onEnterRoom = (roomId: string) => {
        props.socket.emit(MessageType.JOIN_ROOM, roomId, { name: "username" });
        history.push(`/room/${roomId}`);
    };

    React.useEffect(() => {
        if (props.socket) {
            WebUtils.MakeGetRequest("http://localhost:3001/rooms").then(
                (res) => {
                    console.log(res);
                    runInAction(() => {
                        localStore.rooms = res;
                    });
                }
            );
            setInterval(() => {
                WebUtils.MakeGetRequest("http://localhost:3001/rooms").then(
                    (res) => {
                        console.log(res);
                        runInAction(() => {
                            localStore.rooms = res;
                        });
                    }
                );
            }, ROOM_REFRESH_INTERVAL);
        }
    }, [props.socket]);

    return (
        <div className="home-page">
            <NavBar></NavBar>
            {/* <span>Home page</span> */}
            {/* <button onClick={() => {}}>Create room</button> */}
            {/* <button onClick={onEnterRoom}>Enter test room</button> */}
            <div className="rooms">
                <div className="rooms-title">Available Rooms</div>
                <div className="rooms-table">
                    <div className="room-details-row-header-item">Name</div>
                    <div className="room-details-row-header-item">Players</div>
                    <div className="room-details-row-header-item">Action</div>
                    {localStore.rooms.map(
                        (room: { id: string; nPlayers: number }, i) => {
                            return (
                                <>
                                    {/* just use id for now  */}
                                    <div className="room-table-element-container room-title">
                                        {room.id}
                                    </div>{" "}
                                    <div className="room-table-element-container room-n-players">
                                        {room.nPlayers}
                                    </div>
                                    <div className="room-table-element-container join-room-button-container">
                                        <button
                                            className="room-table-element join-room-button"
                                            onClick={(e) => {
                                                onEnterRoom(room.id);
                                            }}
                                        >
                                            Join Room
                                        </button>
                                    </div>
                                </>
                            );
                        }
                    )}
                </div>
            </div>
        </div>
    );
});
