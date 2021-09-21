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

    React.useEffect(() => {
        if (props.socket) {
            WebUtils.MakeGetRequest("http://localhost:3001/rooms")
                .then((res) => {
                    runInAction(() => {
                        if (res.rooms) {
                            localStore.rooms = res.rooms;
                        }
                    });
                })
                .catch((err) => {
                    console.error(err);
                });
            setInterval(() => {
                WebUtils.MakeGetRequest("http://localhost:3001/rooms").then(
                    (res) => {
                        runInAction(() => {
                            if (res.rooms) {
                                localStore.rooms = res.rooms;
                            }
                        });
                    }
                );
            }, ROOM_REFRESH_INTERVAL);
        }
    }, [props.socket]);

    const history = useHistory();

    const onEnterRoom = (roomId: string) => {
        console.log("entering room");
        history.push(`/room/${roomId}`);
    };

    const onCreateRoom = () => {
        // props.socket.emit(MessageType.CREATE_ROOM, { name: "username" });
        WebUtils.MakeGetRequest("http://localhost:3001/createRoom").then(
            (res) => {
                runInAction(() => {
                    onEnterRoom(res.id);
                });
            }
        );
    };

    return (
        <div className="home-page">
            <NavBar></NavBar>
            <div className="create-room-button-container">
                <button onClick={onCreateRoom}>Create room</button>
            </div>
            <div className="rooms">
                <div className="rooms-title">Available Rooms</div>
                <div className="rooms-table">
                    <div className="room-details-row-header-item">Name</div>
                    <div className="room-details-row-header-item">Players</div>
                    <div className="room-details-row-header-item">Action</div>
                    {localStore.rooms.map(
                        (room: { id: string; nPlayers: number }, i) => {
                            return (
                                <React.Fragment key={i}>
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
                                            Join
                                        </button>
                                    </div>
                                </React.Fragment>
                            );
                        }
                    )}
                </div>
            </div>
        </div>
    );
});
