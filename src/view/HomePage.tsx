import React from "react";
import { NavBar } from "./NavBar";
import { useHistory } from "react-router-dom";

export const HomePage = () => {
    const history = useHistory();

    const onEnterRoom = (e: any) => {
        e.preventDefault();
        history.push("/room/test");
    };

    return (
        <div className="home-page">
            <NavBar></NavBar>
            <span>Home page</span>
            {/* <button onClick={() => {}}>Create room</button> */}
            <button onClick={onEnterRoom}>Enter test room</button>
        </div>
    );
};
