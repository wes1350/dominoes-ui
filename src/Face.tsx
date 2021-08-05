import React from "react";
import "./Face.css";

interface IProps {
    num?: number;
    size?: number;
}

export const Face = (props: IProps) => {
    // Temporary, just for error checking

    if (![0, 1, 2, 3, 4, 5, 6].includes(props.num) && !!props.num) {
        console.log("INVALID VALUE FOR FACE NUM!", props.num);
        return (
            <div className="face-container">
                <div className="dot row-1 col-1"></div>
                <div className="dot row-2 col-1"></div>
                <div className="dot row-3 col-1"></div>
                <div className="dot row-1 col-2"></div>
                <div className="dot row-2 col-2"></div>
                <div className="dot row-3 col-2"></div>
                <div className="dot row-1 col-3"></div>
                <div className="dot row-2 col-3"></div>
                <div className="dot row-3 col-3"></div>
            </div>
        );
    }

    let dots;
    if (props.num === 0 || !props.num) {
        dots = <></>;
    }

    if (props.num === 1) {
        dots = (
            <>
                <div className="dot row-2 col-2"></div>
            </>
        );
    }

    if (props.num === 2) {
        dots = (
            <>
                <div className="dot row-1 col-1"></div>
                <div className="dot row-3 col-3"></div>
            </>
        );
    }

    if (props.num === 3) {
        dots = (
            <>
                <div className="dot row-1 col-1"></div>
                <div className="dot row-2 col-2"></div>
                <div className="dot row-3 col-3"></div>
            </>
        );
    }

    if (props.num === 4) {
        dots = (
            <>
                <div className="dot row-1 col-1"></div>
                <div className="dot row-1 col-3"></div>
                <div className="dot row-3 col-1"></div>
                <div className="dot row-3 col-3"></div>
            </>
        );
    }
    if (props.num === 5) {
        dots = (
            <>
                <div className="dot row-1 col-1"></div>
                <div className="dot row-1 col-3"></div>
                <div className="dot row-2 col-2"></div>
                <div className="dot row-3 col-1"></div>
                <div className="dot row-3 col-3"></div>
            </>
        );
    }
    if (props.num === 6) {
        dots = (
            <>
                <div className="dot row-1 col-1"></div>
                <div className="dot row-2 col-1"></div>
                <div className="dot row-3 col-1"></div>
                <div className="dot row-1 col-3"></div>
                <div className="dot row-2 col-3"></div>
                <div className="dot row-3 col-3"></div>
            </>
        );
    }

    return (
        <div
            className="face-container"
            style={{
                width: `${props.size ?? 96}px`,
                height: `${props.size ?? 96}px`
            }}
        >
            {dots}
        </div>
    );
};
