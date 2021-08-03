import React from "react";
import "./Face.css";

interface IProps {
    num: number;
    style?: any;
}

export const Face = (props: IProps) => {
    // Temporary, just for error checking
    if (![0, 1, 2, 3, 4, 5, 6].includes(props.num)) {
        console.log("INVALID VALUE FOR FACE NUM!", props.num);
        return (
            <div className="face-container" style={props.style}>
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

    if (props.num === 0) {
        return <div className="face-container" style={props.style}></div>;
    }

    if (props.num === 1) {
        return (
            <div className="face-container" style={props.style}>
                <div className="dot row-2 col-2" style={props.style}></div>
            </div>
        );
    }

    if (props.num === 2) {
        return (
            <div className="face-container" style={props.style}>
                <div className="dot row-1 col-1"></div>
                <div className="dot row-3 col-3"></div>
            </div>
        );
    }

    if (props.num === 3) {
        return (
            <div className="face-container" style={props.style}>
                <div className="dot row-1 col-1"></div>
                <div className="dot row-2 col-2"></div>
                <div className="dot row-3 col-3"></div>
            </div>
        );
    }

    if (props.num === 4) {
        return (
            <div className="face-container" style={props.style}>
                <div className="dot row-1 col-1"></div>
                <div className="dot row-1 col-3"></div>
                <div className="dot row-3 col-1"></div>
                <div className="dot row-3 col-3"></div>
            </div>
        );
    }
    if (props.num === 5) {
        return (
            <div className="face-container" style={props.style}>
                <div className="dot row-1 col-1"></div>
                <div className="dot row-1 col-3"></div>
                <div className="dot row-2 col-2"></div>
                <div className="dot row-3 col-1"></div>
                <div className="dot row-3 col-3"></div>
            </div>
        );
    }
    if (props.num === 6) {
        return (
            <div className="face-container" style={props.style}>
                <div className="dot row-1 col-1"></div>
                <div className="dot row-2 col-1"></div>
                <div className="dot row-3 col-1"></div>
                <div className="dot row-1 col-3"></div>
                <div className="dot row-2 col-3"></div>
                <div className="dot row-3 col-3"></div>
            </div>
        );
    }
};
