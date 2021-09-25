import React from "react";
import "./NameDialog.css";
import { observer, useLocalObservable } from "mobx-react-lite";
import { action } from "mobx";

interface IProps {
    onSubmitName: (name: string) => void;
}

export const NameDialog = observer((props: IProps) => {
    const inputRef = React.useRef<HTMLInputElement>();

    const localStore = useLocalObservable(() => ({
        nameValue: ""
    }));
    // {
    //     /* <PlayerNameContext.Provider
    //             value={{
    //                 name: localStore.playerName,
    //                 setName: (name: string) => {
    //                     if (name) {
    //                         BackendGateway.SetName(name).then(
    //                             action(() => {
    //                                 localStore.playerName = name;
    //                             })
    //                         );
    //                     }
    //                 }
    //             }}
    //         > */
    // }

    return (
        <div className="username-dialog">
            <div className="username-dialog-name">Please enter your name:</div>
            <div className="username-dialog-input-container">
                <input
                    ref={inputRef}
                    type="text"
                    value={localStore.nameValue}
                    onChange={action((e: React.FormEvent<HTMLInputElement>) => {
                        localStore.nameValue = e.currentTarget.value;
                    })}
                />
            </div>
            <div className="username-dialog-button-container">
                <button
                    type="button"
                    onClick={() => {
                        props.onSubmitName(localStore.nameValue);
                    }}
                >
                    Save
                </button>
            </div>
        </div>
    );
});
