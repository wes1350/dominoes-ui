import React, { useState } from "react";
import { Direction } from "./Direction";
import { Domino } from "./Domino";
import { QueryType } from "./Enums";
import { GameState } from "./GameState";
import { Player } from "./Player";
import "./PlayerView.css";

interface IProps {
    gameState: GameState;
    respond: (type: QueryType, value: any) => void;
}

export const UserInput = (props: IProps) => {
    const [inputValue, setInputValue] = useState("");

    const onSubmit = (e: any) => {
        // props.socket.emit(this.props.responseType, this.state.value);
        console.log("responding:", inputValue);
        props.respond(props.gameState.CurrentQueryType, inputValue);
        setInputValue("");
        e.preventDefault();
    };
    return (
        // <div>
        //     Move:
        //     <input
        //         type="text"
        //         value={inputValue}
        //         onChange={(e: any) => {
        //             setInputValue(e.target.value);
        //         }}
        //     />
        // </div>

        <div className={"input-container"}>
            <form onSubmit={onSubmit}>
                <div>
                    Move:
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e: any) => {
                            setInputValue(e.target.value);
                        }}
                    />
                </div>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
};
