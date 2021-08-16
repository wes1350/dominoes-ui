import React, { useState } from "react";
import { QueryType } from "./Enums";
import { GameState } from "./GameState";

interface IProps {
    gameState: GameState;
    respond: (type: QueryType, value: any) => void;
}

export const UserInput = (props: IProps) => {
    console.log(props.gameState.Dominos);
    const [inputValue, setInputValue] = useState("");

    const onSubmit = (e: any) => {
        props.respond(props.gameState.CurrentQueryType, inputValue);
        setInputValue("");
        e.preventDefault();
    };
    return (
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