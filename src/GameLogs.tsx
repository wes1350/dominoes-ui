import React, { useEffect, useRef } from "react";
import "./GameLogs.css";

interface IProps {
    logs: string[];
}

export const GameLogs = (props: IProps) => {
    const endOfLogsRef = useRef(null);

    const scrollToBottom = () => {
        endOfLogsRef.current?.scrollIntoView();
    };

    useEffect(() => {
        scrollToBottom();
    }, [props.logs.length]);

    return (
        <div className={"game-logs-container"}>
            {props.logs.map((log) => {
                return <div>{log}</div>;
            })}
            <div ref={endOfLogsRef}></div>
        </div>
    );
};
