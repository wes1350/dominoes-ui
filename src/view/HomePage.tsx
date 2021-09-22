import React from "react";
import { NavBar } from "./NavBar";
import { useHistory } from "react-router-dom";
import { observer, useLocalObservable } from "mobx-react-lite";
import { runInAction } from "mobx";
import "./HomePage.css";
import { BackendGateway } from "io/BackendGateway";

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
            const getRooms = () => {
                BackendGateway.GetCurrentRooms().then((rooms) => {
                    if (rooms) {
                        runInAction(() => {
                            localStore.rooms = rooms;
                        });
                    }
                });
            };

            getRooms();
            setInterval(getRooms, ROOM_REFRESH_INTERVAL);
        }
    }, [props.socket]);

    const history = useHistory();

    const onEnterRoom = (roomId: string) => {
        console.log("entering room");
        history.push(`/room/${roomId}`);
    };

    const onCreateRoom = () => {
        BackendGateway.CreateRoom().then((res) => {
            onEnterRoom(res);
        });
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
