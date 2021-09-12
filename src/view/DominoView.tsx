import React from "react";
import "./DominoView.css";
import { Direction } from "enums/Direction";
import { observer } from "mobx-react-lite";

interface IProps {
    face1: number;
    face2: number;
    direction: Direction;
    size?: number;
    highlight?: boolean;
}

export const DominoView = observer((props: IProps) => {
    const isHiddenDomino = props.face1 === -1 || props.face2 === -1;
    const dominoBackgroundFill = "#F7EEE1";
    const dominoFeatureFill = "#000";
    const shrinkFactor = 0.975;
    const highlightOverflowFactor = 1.1;

    const getFaceCircles = (number: number, face: "face1" | "face2") => {
        const offset = face === "face1" ? 0 : 50;
        const x1 = "25%";
        const x2 = "50%";
        const x3 = "75%";
        const y1 = `${12.5 + offset}%`;
        const y2 = `${25 + offset}%`;
        const y3 = `${37.5 + offset}%`;
        const r = "5%";
        const fill = "#000";

        const circles = [];
        if ([2, 3, 4, 5, 6].includes(number)) {
            circles.push(<circle key={1} cx={x1} cy={y1} r={r} fill={fill} />);
        }
        if ([6].includes(number)) {
            circles.push(<circle key={2} cx={x1} cy={y2} r={r} fill={fill} />);
        }
        if ([4, 5, 6].includes(number)) {
            circles.push(<circle key={3} cx={x1} cy={y3} r={r} fill={fill} />);
        }
        if ([1, 3, 5].includes(number)) {
            circles.push(<circle key={5} cx={x2} cy={y2} r={r} fill={fill} />);
        }
        if ([4, 5, 6].includes(number)) {
            circles.push(<circle key={7} cx={x3} cy={y1} r={r} fill={fill} />);
        }
        if ([6].includes(number)) {
            circles.push(<circle key={8} cx={x3} cy={y2} r={r} fill={fill} />);
        }
        if ([2, 3, 4, 5, 6].includes(number)) {
            circles.push(<circle key={9} cx={x3} cy={y3} r={r} fill={fill} />);
        }
        return circles;
    };

    // Default direction is going from North -> South
    let dominoStyle;
    const baseStyle = {
        width: props.size,
        height: 2 * props.size
    };
    if (props.direction === Direction.NORTH) {
        dominoStyle = {
            ...baseStyle,
            transform: "rotate(180deg)"
        };
    } else if (props.direction === Direction.SOUTH) {
        dominoStyle = baseStyle;
    } else if (props.direction === Direction.EAST) {
        dominoStyle = {
            ...baseStyle,
            transform: "rotate(270deg) translate(50%, 25%)"
        };
    } else if (props.direction === Direction.WEST) {
        dominoStyle = {
            ...baseStyle,
            transform: "rotate(90deg) translate(-50%, -25%)"
        };
    } else {
        dominoStyle = baseStyle;
    }

    let highlightTransform;
    if (props.direction === Direction.NORTH) {
        highlightTransform = `rotate(180deg) translate(${
            50 * (highlightOverflowFactor - 1)
        }%, ${50 * (highlightOverflowFactor - 1)}%)`;
    } else if (props.direction === Direction.SOUTH) {
        highlightTransform = `translate(-${
            50 * (highlightOverflowFactor - 1)
        }%, -${50 * (highlightOverflowFactor - 1)}%)`;
    } else if (props.direction === Direction.EAST) {
        highlightTransform = `rotate(270deg) translate(${
            50 * highlightOverflowFactor
        }%, ${
            25 * highlightOverflowFactor - 75 * (highlightOverflowFactor - 1)
        }%)`;
    } else if (props.direction === Direction.WEST) {
        highlightTransform = `rotate(90deg) translate(-${
            50 * highlightOverflowFactor
        }%, -${
            25 * highlightOverflowFactor - 75 * (highlightOverflowFactor - 1)
        }%)`;
    } else {
        highlightTransform = null;
    }

    return (
        <>
            <div className={"domino-outer-container"}>
                {props.highlight && (
                    <div
                        className="domino-drop-highlight"
                        style={{
                            position: "absolute",
                            backgroundColor: "red",
                            width: highlightOverflowFactor * props.size,
                            height: highlightOverflowFactor * 2 * props.size,
                            zIndex: 0,
                            transform: highlightTransform
                        }}
                    ></div>
                )}
                <div
                    className={"domino-svg-container"}
                    style={{ ...dominoStyle, zIndex: 1 }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={"100%"}
                        height={"100%"}
                        version="1.1"
                    >
                        <rect
                            x={`${(100 * (1 - shrinkFactor)) / 2}%`}
                            y={`${(100 * (1 - shrinkFactor)) / 2}%`}
                            width={`${100 * shrinkFactor}%`}
                            height={`${100 * shrinkFactor}%`}
                            rx="10%"
                            fill={dominoBackgroundFill}
                        />

                        {!isHiddenDomino && (
                            <>
                                {getFaceCircles(props.face1, "face1")}

                                <line
                                    x1="5%"
                                    y1="50%"
                                    x2="95%"
                                    y2="50%"
                                    stroke={dominoFeatureFill}
                                    strokeWidth="1.5%"
                                />

                                {getFaceCircles(props.face2, "face2")}
                            </>
                        )}
                    </svg>
                </div>
            </div>
        </>
    );
});
