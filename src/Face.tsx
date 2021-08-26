import React from "react";
import { ReactComponent as ReactFace0 } from "./faces/face0.svg";
import { ReactComponent as ReactFace1 } from "./faces/face1.svg";
import { ReactComponent as ReactFace2 } from "./faces/face2.svg";
import { ReactComponent as ReactFace3 } from "./faces/face3.svg";
import { ReactComponent as ReactFace4 } from "./faces/face4.svg";
import { ReactComponent as ReactFace5 } from "./faces/face5.svg";
import { ReactComponent as ReactFace6 } from "./faces/face6.svg";

interface IProps {
    num?: number;
    size?: number;
}

export const Face = (props: IProps) => {
    const faces = [
        <ReactFace0 />,
        <ReactFace1 />,
        <ReactFace2 />,
        <ReactFace3 />,
        <ReactFace4 />,
        <ReactFace5 />,
        <ReactFace6 />
    ];

    return (
        <div
            style={{
                width: `${props.size ?? 96}px`,
                height: `${props.size ?? 96}px`
            }}
        >
            {faces[props.num ?? 0]}
        </div>
    );
};
