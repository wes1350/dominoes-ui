import React from "react";
import "./GameLogs.css";

interface IProps {
    logs: string[];
}

export const GameLogs = (props: IProps) => {
    return (
        <div className={"game-logs-container"}>
            {props.logs.map((log) => {
                return <div>{log}</div>;
            })}
        </div>
    );
};
