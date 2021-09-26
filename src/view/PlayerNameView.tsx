import React, { useContext } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { PlayerDataContext } from "context/PlayerDataContext";
import "./PlayerNameView.css";
import { NameDialog } from "./NameDialog";
import { action } from "mobx";

export const PlayerNameView = observer(() => {
    const nameContext = useContext(PlayerDataContext);

    const localStore = useLocalObservable(() => ({
        nameDialogActive: false
    }));

    const onNameClick = action(() => {
        localStore.nameDialogActive = !localStore.nameDialogActive;
    });

    return (
        <div className="player-name-view">
            <div onClick={onNameClick}>
                {nameContext.name ?? "anonymous user"}
            </div>
            {localStore.nameDialogActive && (
                <NameDialog
                    onSubmit={action(() => {
                        localStore.nameDialogActive = false;
                    })}
                />
            )}
        </div>
    );
});
