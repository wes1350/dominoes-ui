import { Direction } from "enums/Direction";
// import { IBoardDomino } from "model/BoardDominoModel";
import React, { useRef, useState } from "react";
import "./BoardView.css";
import { BoardDominoView } from "./BoardDominoView";
// import { BoardDominoDropArea } from "./BoardDominoDropArea";
import { DominoView } from "./DominoView";
import { IBoard } from "model/BoardModel";
import { observer, useLocalObservable } from "mobx-react-lite";

interface IProps {
    board: IBoard;
    width: number;
    height: number;
    onDropDomino: (
        dominoFaces: { face1: number; face2: number },
        direction: Direction
    ) => void;
    // dominoBeingDragged: IDomino;
}

export const BoardView = observer((props: IProps) => {
    // const rotateDirection = (direction: Direction) => {
    //     return direction === Direction.NORTH
    //         ? Direction.EAST
    //         : direction === Direction.EAST
    //         ? Direction.SOUTH
    //         : direction === Direction.SOUTH
    //         ? Direction.WEST
    //         : Direction.NORTH;
    // };

    // const minVerticalBendThreshold = 8;
    // const minHorizontalBendThreshold = 20;

    // const findNorthBendThreshold = (
    //     translatedDescriptions: TranslatedDominoDescription[]
    // ) => {
    //     const sortedDescriptions = translatedDescriptions
    //         .filter((desc) => desc.south <= -1 * minVerticalBendThreshold)
    //         .sort((a, b) => b.north - a.north);
    //     for (let i = 0; i < sortedDescriptions.length - 1; i++) {
    //         const desc = sortedDescriptions[i];
    //         if (i < sortedDescriptions.length - 1) {
    //             if (!isDouble(desc) && !isDouble(sortedDescriptions[i + 1])) {
    //                 return desc.north;
    //             }
    //         }
    //     }
    //     return -1000;
    // };

    // const findSouthBendThreshold = (
    //     translatedDescriptions: TranslatedDominoDescription[]
    // ) => {
    //     const sortedDescriptions = translatedDescriptions
    //         .filter((desc) => desc.north >= minVerticalBendThreshold)
    //         .sort((a, b) => a.north - b.north);
    //     for (let i = 0; i < sortedDescriptions.length - 1; i++) {
    //         const desc = sortedDescriptions[i];
    //         if (i < sortedDescriptions.length - 1) {
    //             if (!isDouble(desc) && !isDouble(sortedDescriptions[i + 1])) {
    //                 return desc.south;
    //             }
    //         }
    //     }
    //     return 1000;
    // };

    // const findEastBendThreshold = (
    //     translatedDescriptions: TranslatedDominoDescription[]
    // ) => {
    //     const sortedDescriptions = translatedDescriptions
    //         .filter((desc) => desc.west >= minHorizontalBendThreshold)
    //         .sort((a, b) => a.east - b.east);
    //     for (let i = 0; i < sortedDescriptions.length - 1; i++) {
    //         const desc = sortedDescriptions[i];
    //         if (i < sortedDescriptions.length - 1) {
    //             if (!isDouble(desc) && !isDouble(sortedDescriptions[i + 1])) {
    //                 return desc.east;
    //             }
    //         }
    //     }
    //     return 1000;
    // };

    // const findWestBendThreshold = (
    //     translatedDescriptions: TranslatedDominoDescription[]
    // ) => {
    //     const sortedDescriptions = translatedDescriptions
    //         .filter((desc) => desc.east <= -1 * minHorizontalBendThreshold)
    //         .sort((a, b) => b.east - a.east);
    //     for (let i = 0; i < sortedDescriptions.length - 1; i++) {
    //         const desc = sortedDescriptions[i];
    //         if (i < sortedDescriptions.length - 1) {
    //             if (!isDouble(desc) && !isDouble(sortedDescriptions[i + 1])) {
    //                 return desc.west;
    //             }
    //         }
    //     }
    //     return -1000;
    // };

    // const bendDescriptions = (
    //     descriptions: TranslatedDominoDescription[],
    //     dropAreaBoundingBoxes: Map<boolean, Map<Direction, IBoundingBox>>
    // ): {
    //     descriptions: TranslatedDominoDescription[];
    //     dropAreaBoundingBoxes: Map<boolean, Map<Direction, IBoundingBox>>;
    // } => {
    //     if (descriptions.length === 0) {
    //         return {
    //             descriptions: [],
    //             dropAreaBoundingBoxes: dropAreaBoundingBoxes
    //         };
    //     }

    //     const bentDescriptions: TranslatedDominoDescription[] = [];

    //     const northBendThreshold = findNorthBendThreshold(descriptions);
    //     const eastBendThreshold = findEastBendThreshold(descriptions);
    //     const southBendThreshold = findSouthBendThreshold(descriptions);
    //     const westBendThreshold = findWestBendThreshold(descriptions);

    //     const maxNorthPreBend = Math.max(
    //         ...descriptions.map((desc) =>
    //             desc.north <= northBendThreshold ? desc.north : -1000
    //         )
    //     );
    //     const northLimitBoundingBox = descriptions.find(
    //         (desc) => desc.north === maxNorthPreBend
    //     );

    //     const maxEastPreBend = Math.min(
    //         ...descriptions.map((desc) =>
    //             desc.east >= eastBendThreshold ? desc.east : 1000
    //         )
    //     );
    //     const eastLimitBoundingBox = descriptions.find(
    //         (desc) => desc.east === maxEastPreBend
    //     );

    //     const maxSouthPreBend = Math.min(
    //         ...descriptions.map((desc) =>
    //             desc.south >= southBendThreshold ? desc.south : 1000
    //         )
    //     );
    //     const southLimitBoundingBox = descriptions.find(
    //         (desc) => desc.south === maxSouthPreBend
    //     );

    //     const maxWestPreBend = Math.max(
    //         ...descriptions.map((desc) =>
    //             desc.west <= westBendThreshold ? desc.west : -1000
    //         )
    //     );
    //     const westLimitBoundingBox = descriptions.find(
    //         (desc) => desc.west === maxWestPreBend
    //     );

    //     const newNorthOrigin = northLimitBoundingBox
    //         ? {
    //               x: northLimitBoundingBox.west,
    //               y: northLimitBoundingBox.north
    //           }
    //         : null;

    //     const newEastOrigin = eastLimitBoundingBox
    //         ? {
    //               x: eastLimitBoundingBox.east,
    //               y: eastLimitBoundingBox.north
    //           }
    //         : null;

    //     const newSouthOrigin = southLimitBoundingBox
    //         ? {
    //               x: southLimitBoundingBox.east,
    //               y: southLimitBoundingBox.south
    //           }
    //         : null;

    //     const newWestOrigin = westLimitBoundingBox
    //         ? {
    //               x: westLimitBoundingBox.west,
    //               y: westLimitBoundingBox.south
    //           }
    //         : null;

    //     const generateNextBentDominoDescription = (
    //         desc: TranslatedDominoDescription
    //     ) => {
    //         if (desc.south <= northBendThreshold) {
    //             return {
    //                 ...desc,
    //                 north: newNorthOrigin.y - (desc.east - newNorthOrigin.x),
    //                 east: newNorthOrigin.x - (desc.north - newNorthOrigin.y),
    //                 south: newNorthOrigin.y - (desc.west - newNorthOrigin.x),
    //                 west: newNorthOrigin.x - (desc.south - newNorthOrigin.y),
    //                 direction: rotateDirection(desc.direction)
    //             };
    //         } else if (desc.north >= southBendThreshold) {
    //             return {
    //                 ...desc,
    //                 north: newSouthOrigin.y - (desc.west - newSouthOrigin.x),
    //                 east: newSouthOrigin.x - (desc.south - newSouthOrigin.y),
    //                 south: newSouthOrigin.y - (desc.east - newSouthOrigin.x),
    //                 west: newSouthOrigin.x - (desc.north - newSouthOrigin.y),
    //                 direction: rotateDirection(desc.direction)
    //             };
    //             // Need to ensure we do this only if the spinner has been encountered here
    //         } else if (desc.west >= eastBendThreshold) {
    //             return {
    //                 ...desc,
    //                 north: newEastOrigin.y + (desc.east - newEastOrigin.x),
    //                 east: newEastOrigin.x + (desc.north - newEastOrigin.y),
    //                 south: newEastOrigin.y + (desc.west - newEastOrigin.x),
    //                 west: newEastOrigin.x + (desc.south - newEastOrigin.y),
    //                 direction: rotateDirection(desc.direction)
    //             };
    //         } else if (desc.east <= westBendThreshold) {
    //             return {
    //                 ...desc,
    //                 north: newWestOrigin.y + (desc.west - newWestOrigin.x),
    //                 east: newWestOrigin.x + (desc.south - newWestOrigin.y),
    //                 south: newWestOrigin.y + (desc.east - newWestOrigin.x),
    //                 west: newWestOrigin.x + (desc.north - newWestOrigin.y),
    //                 direction: rotateDirection(desc.direction)
    //             };
    //         } else {
    //             return desc;
    //         }
    //     };

    //     descriptions.forEach((desc, i) => {
    //         bentDescriptions.push(generateNextBentDominoDescription(desc));
    //     });

    //     // Bend the drop area bounding boxes

    //     const bentDropAreaBoundingBoxes = new Map<
    //         boolean,
    //         Map<Direction, IBoundingBox>
    //     >();

    //     bentDropAreaBoundingBoxes.set(false, new Map());
    //     bentDropAreaBoundingBoxes.set(true, new Map());

    //     [true, false].forEach((isDouble) => {
    //         const boundingBoxMap = dropAreaBoundingBoxes.get(isDouble);
    //         Array.from(boundingBoxMap.keys()).forEach((direction) => {
    //             const translatedBoundingBox = boundingBoxMap.get(direction);
    //             const mockDominoDescription = {
    //                 north: translatedBoundingBox.north,
    //                 east: translatedBoundingBox.east,
    //                 south: translatedBoundingBox.south,
    //                 west: translatedBoundingBox.west,
    //                 face1: 0,
    //                 face2: isDouble ? 0 : 1,
    //                 direction: Direction.NONE // doesn't matter
    //             };
    //             bentDropAreaBoundingBoxes
    //                 .get(isDouble)
    //                 .set(
    //                     direction,
    //                     generateNextBentDominoDescription(mockDominoDescription)
    //                 );
    //         });
    //     });

    //     return {
    //         descriptions: bentDescriptions,
    //         dropAreaBoundingBoxes: bentDropAreaBoundingBoxes
    //     };
    // };

    // const translatedDescriptions = translateDescriptionsToActualSizes(
    //     props.dominoes
    // );

    // const bentDescriptions = bendDescriptions(
    //     translatedDescriptions.descriptions,
    //     translatedDescriptions.dropAreaBoundingBoxes
    // );

    // const bentDominoDescriptions = bentDescriptions.descriptions;
    // const bentDropAreaDescriptions = bentDescriptions.dropAreaBoundingBoxes;

    let westBoundary;
    let eastBoundary;
    let northBoundary;
    let southBoundary;

    // if (bentDominoDescriptions.length > 0) {
    //     westBoundary =
    //         Math.min(...bentDominoDescriptions.map((desc) => desc.west)) - 4;
    //     eastBoundary =
    //         Math.max(...bentDominoDescriptions.map((desc) => desc.east)) + 4;
    //     northBoundary =
    //         Math.min(...bentDominoDescriptions.map((desc) => desc.north)) - 4;
    //     southBoundary =
    //         Math.max(...bentDominoDescriptions.map((desc) => desc.north)) + 4;
    // } else {
    //     westBoundary = -10;
    //     eastBoundary = 10;
    //     northBoundary = -10;
    //     southBoundary = 10;
    // }

    if (props.board.IsEmpty) {
        northBoundary = -10;
        southBoundary = 10;
        eastBoundary = 10;
        westBoundary = -10;
    } else {
        northBoundary = props.board.RenderedNorthBoundary;
        southBoundary = props.board.RenderedSouthBoundary;
        eastBoundary = props.board.RenderedEastBoundary;
        westBoundary = props.board.RenderedWestBoundary;
    }

    const minGridWidthInSquares = eastBoundary - westBoundary;
    const minGridHeightInSquares = southBoundary - northBoundary;

    // const availableHeight = window.innerHeight - 300;
    // const availableWidth = window.innerWidth - 300;
    const availableHeight = props.height;
    const availableWidth = props.width;
    const limitingRatio = Math.min(
        availableHeight / minGridHeightInSquares,
        availableWidth / minGridWidthInSquares
    );
    // This will be used to determine how many squares there should be
    // The final size will be determined dynamically through css grid fractional sizing
    const gridSizeInPixels = Math.min(limitingRatio, 20);
    const gridWidthInSquares = Math.floor(availableWidth / gridSizeInPixels);
    const gridHeightInSquares = Math.floor(availableHeight / gridSizeInPixels);

    const gridHorizontalSquareMargin = Math.ceil(
        (gridWidthInSquares - minGridWidthInSquares) / 2
    );
    const gridVerticalSquareMargin = Math.ceil(
        (gridHeightInSquares - minGridHeightInSquares) / 2
    );

    // debugger;

    const verticalShift = gridVerticalSquareMargin - northBoundary;
    const horizontalShift = gridHorizontalSquareMargin - westBoundary;
    // const northShift = gridVerticalSquareMargin - northBoundary;
    // const eastShift = gridHorizontalSquareMargin - westBoundary;
    // const southShift = gridVerticalSquareMargin - northBoundary;
    // const westShift = gridHorizontalSquareMargin - westBoundary;

    // console.log("shifts:", northShift, eastShift, southShift, westShift);

    // const finalDominoDescriptions = bentDominoDescriptions.map((desc) => {
    //     return {
    //         ...desc,
    //         north: desc.north + northShift,
    //         east: desc.east + eastShift,
    //         south: desc.south + southShift,
    //         west: desc.west + westShift
    //     };
    // });
    // console.log(finalDominoDescriptions);

    return (
        <div
            className="board"
            style={{
                gridTemplateRows: `repeat(${gridHeightInSquares}, ${
                    gridSizeInPixels + 1 // + 1 accounts for borders
                }px)`,
                gridTemplateColumns: `repeat(${gridWidthInSquares}, ${
                    gridSizeInPixels + 1 // + 1 accounts for borders
                }px)`
            }}
        >
            {props.board.Dominoes.map((domino, i) => {
                return (
                    <BoardDominoView
                        key={i}
                        north={domino.BoundingBox.North + verticalShift}
                        east={domino.BoundingBox.East + horizontalShift}
                        south={domino.BoundingBox.South + verticalShift}
                        west={domino.BoundingBox.West + horizontalShift}
                    >
                        <DominoView
                            face1={domino.Face1}
                            face2={domino.Face2}
                            direction={domino.Direction}
                            size={gridSizeInPixels * 2}
                        />
                    </BoardDominoView>
                );
            })}
            {/* {Array.from(bentDropAreaDescriptions.get(false).keys()).map(
                (direction, i) => {
                    const box = bentDropAreaDescriptions
                        .get(false)
                        .get(direction);
                    return (
                        <BoardDominoDropArea
                            key={"false" + direction}
                            north={box.north + northShift}
                            east={box.east + eastShift}
                            south={box.south + southShift}
                            west={box.west + westShift}
                            boardDirection={direction}
                            onDropDomino={props.onDropDomino}
                            isActive={
                                // props.dominoBeingDragged
                                //     ? !props.dominoBeingDragged.IsDouble
                                //     : false
                                false
                            }
                        ></BoardDominoDropArea>
                    );
                }
            )}
            {Array.from(bentDropAreaDescriptions.get(true).keys()).map(
                (direction, i) => {
                    const box = bentDropAreaDescriptions
                        .get(true)
                        .get(direction);
                    return (
                        <BoardDominoDropArea
                            key={"true" + direction}
                            north={box.north + northShift}
                            east={box.east + eastShift}
                            south={box.south + southShift}
                            west={box.west + westShift}
                            boardDirection={direction}
                            onDropDomino={props.onDropDomino}
                            isActive={
                                // props.dominoBeingDragged
                                //     ? props.dominoBeingDragged.IsDouble
                                //     : false
                                false
                            }
                        ></BoardDominoDropArea>
                    );
                }
            )} */}
        </div>
    );
});
