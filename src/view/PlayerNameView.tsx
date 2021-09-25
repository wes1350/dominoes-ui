import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { PlayerDataContext } from "context/PlayerDataContext";

export const PlayerNameView = observer(() => {
    const nameContext = useContext(PlayerDataContext);
    return (
        <div
            className="player-name-view"
            style={{
                position: "fixed",
                top: "0%",
                right: "0%",
                width: "15%",
                height: "5%"
            }}
        >
            {nameContext.name ?? "anonymous user"}
        </div>
    );
});
