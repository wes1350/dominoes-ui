import _ from "lodash";
import React, { useState } from "react";
import "./Board.css";
import { Direction } from "./Direction";
import { Domino } from "./Domino";
import { DominoDescription } from "./DominoDescription";

interface CoordinateDescription {
    x: number;
    y: number;
    double: boolean;
}

interface BoundingBoxDescription {
    north: number;
    east: number;
    south: number;
    west: number;
}

interface TranslatedDominoDescription {
    face1?: number;
    face2?: number;
    direction: Direction;
    north: number;
    east: number;
    south: number;
    west: number;
}

interface IProps {
    dominoDescriptions: DominoDescription[];
}

const addValueToNestedMap = (
    map: Map<any, Map<any, any>>,
    value1: any,
    value2: any,
    value3: any
) => {
    if (!map.has(value1)) {
        map.set(value1, new Map());
    }
    map.get(value1).set(value2, value3);
};

export const Board = (props: IProps) => {
    const coordinatesToBoundingBoxes = new Map<
        number,
        Map<number, BoundingBoxDescription>
    >();
    // double = true, else = false
    const coordinatesToIsDouble = new Map<number, Map<number, boolean>>();
    const isDouble = (desc: DominoDescription): boolean => {
        return desc.face1 === desc.face2;
    };

    const rotateDirection = (direction: Direction) => {
        return direction === Direction.NORTH
            ? Direction.EAST
            : direction === Direction.EAST
            ? Direction.SOUTH
            : direction === Direction.SOUTH
            ? Direction.WEST
            : Direction.NORTH;
    };

    const translateDescriptionsToActualSizes = (
        descriptions: DominoDescription[]
    ): TranslatedDominoDescription[] => {
        const newDescriptions: TranslatedDominoDescription[] = [];
        // Keep track of coordinates of the most extreme dominoes in each direction
        // For north/south, this will originate with the spinner
        let currentNorthEdge: CoordinateDescription = null;
        let currentEastEdge: CoordinateDescription = null;
        let currentSouthEdge: CoordinateDescription = null;
        let currentWestEdge: CoordinateDescription = null;

        descriptions.forEach((desc, i) => {
            if (i === 0) {
                // first domino is always at 0, 0
                if (isDouble(desc)) {
                    addValueToNestedMap(coordinatesToBoundingBoxes, 0, 0, {
                        north: -2,
                        east: 1,
                        south: 2,
                        west: -1
                    });
                    addValueToNestedMap(coordinatesToIsDouble, 0, 0, true);

                    currentNorthEdge = { x: 0, y: 0, double: true };
                    currentEastEdge = { x: 0, y: 0, double: true };
                    currentSouthEdge = { x: 0, y: 0, double: true };
                    currentWestEdge = { x: 0, y: 0, double: true };
                } else {
                    addValueToNestedMap(coordinatesToBoundingBoxes, 0, 0, {
                        north: -1,
                        east: 2,
                        south: 1,
                        west: -2
                    });
                    addValueToNestedMap(coordinatesToIsDouble, 0, 0, false);
                    currentEastEdge = { x: 0, y: 0, double: false };
                    currentWestEdge = { x: 0, y: 0, double: false };
                    // this is not the spinner, so don't set the north/south edges
                }
            } else {
                if (isDouble(desc) && !currentNorthEdge) {
                    // This is the spinner, set the north/south edges properly
                    currentNorthEdge = { x: desc.x, y: 0, double: true };
                    currentSouthEdge = { x: desc.x, y: 0, double: true };
                }

                if (desc.y > 0) {
                    // adding on north side
                    const boxAtEdge = coordinatesToBoundingBoxes
                        .get(currentNorthEdge.x)
                        .get(currentNorthEdge.y);

                    addValueToNestedMap(
                        coordinatesToBoundingBoxes,
                        desc.x,
                        desc.y,
                        {
                            north: isDouble(desc)
                                ? boxAtEdge.north - 2
                                : boxAtEdge.north - 4,
                            east: isDouble(desc)
                                ? boxAtEdge.east + 1
                                : boxAtEdge.east -
                                  (currentNorthEdge.double &&
                                  currentNorthEdge.y !== 0
                                      ? 1
                                      : 0),
                            south: boxAtEdge.north,
                            west: isDouble(desc)
                                ? boxAtEdge.west - 1
                                : boxAtEdge.west +
                                  (currentNorthEdge.double &&
                                  currentNorthEdge.y !== 0
                                      ? 1
                                      : 0)
                        }
                    );

                    addValueToNestedMap(
                        coordinatesToIsDouble,
                        desc.x,
                        desc.y,
                        isDouble(desc)
                    );
                    currentNorthEdge = {
                        x: desc.x,
                        y: desc.y,
                        double: isDouble(desc)
                    };
                } else if (desc.y < 0) {
                    // adding on south side
                    const boxAtEdge = coordinatesToBoundingBoxes
                        .get(currentSouthEdge.x)
                        .get(currentSouthEdge.y);

                    addValueToNestedMap(
                        coordinatesToBoundingBoxes,
                        desc.x,
                        desc.y,
                        {
                            north: boxAtEdge.south,
                            east: isDouble(desc)
                                ? boxAtEdge.east + 1
                                : boxAtEdge.east -
                                  (currentSouthEdge.double &&
                                  currentSouthEdge.y !== 0
                                      ? 1
                                      : 0),
                            south: isDouble(desc)
                                ? boxAtEdge.south + 2
                                : boxAtEdge.south + 4,
                            west: isDouble(desc)
                                ? boxAtEdge.west - 1
                                : boxAtEdge.west +
                                  (currentSouthEdge.double &&
                                  currentSouthEdge.y !== 0
                                      ? 1
                                      : 0)
                        }
                    );
                    addValueToNestedMap(
                        coordinatesToIsDouble,
                        desc.x,
                        desc.y,
                        isDouble(desc)
                    );
                    currentSouthEdge = {
                        x: desc.x,
                        y: desc.y,
                        double: isDouble(desc)
                    };
                } else if (desc.x > 0) {
                    // adding on east side
                    const boxAtEdge = coordinatesToBoundingBoxes
                        .get(currentEastEdge.x)
                        .get(currentEastEdge.y);

                    addValueToNestedMap(
                        coordinatesToBoundingBoxes,
                        desc.x,
                        desc.y,
                        {
                            north: isDouble(desc)
                                ? boxAtEdge.north - 1
                                : boxAtEdge.north +
                                  (currentEastEdge.double ? 1 : 0),
                            east: isDouble(desc)
                                ? boxAtEdge.east + 2
                                : boxAtEdge.east + 4,
                            south: isDouble(desc)
                                ? boxAtEdge.south + 1
                                : boxAtEdge.south -
                                  (currentEastEdge.double ? 1 : 0),
                            west: boxAtEdge.east
                        }
                    );
                    addValueToNestedMap(
                        coordinatesToIsDouble,
                        desc.x,
                        desc.y,
                        isDouble(desc)
                    );
                    currentEastEdge = {
                        x: desc.x,
                        y: desc.y,
                        double: isDouble(desc)
                    };
                } else if (desc.x < 0) {
                    // adding on west side
                    const boxAtEdge = coordinatesToBoundingBoxes
                        .get(currentWestEdge.x)
                        .get(currentWestEdge.y);

                    addValueToNestedMap(
                        coordinatesToBoundingBoxes,
                        desc.x,
                        desc.y,
                        {
                            north: isDouble(desc)
                                ? boxAtEdge.north - 1
                                : boxAtEdge.north +
                                  (currentWestEdge.double ? 1 : 0),
                            east: boxAtEdge.west,
                            south: isDouble(desc)
                                ? boxAtEdge.south + 1
                                : boxAtEdge.south -
                                  (currentWestEdge.double ? 1 : 0),
                            west: isDouble(desc)
                                ? boxAtEdge.west - 2
                                : boxAtEdge.west - 4
                        }
                    );
                    addValueToNestedMap(
                        coordinatesToIsDouble,
                        desc.x,
                        desc.y,
                        isDouble(desc)
                    );
                    currentWestEdge = {
                        x: desc.x,
                        y: desc.y,
                        double: isDouble(desc)
                    };
                }
            }

            const currentBoundingBox = coordinatesToBoundingBoxes
                .get(desc.x)
                .get(desc.y);

            newDescriptions.push({
                ...desc,
                north: currentBoundingBox.north,
                east: currentBoundingBox.east,
                south: currentBoundingBox.south,
                west: currentBoundingBox.west
            });
        });

        console.log("new:", newDescriptions);
        return newDescriptions;
    };

    const bendDescriptions = (
        translatedDescriptions: TranslatedDominoDescription[]
    ) => {
        const bentDescriptions: TranslatedDominoDescription[] = [];

        const maxNorthPreBend = Math.max(
            ...translatedDescriptions.map((desc) =>
                desc.north <= -14 ? desc.north : -1000
            )
        );
        const northLimitBoundingBox = translatedDescriptions.find(
            (desc) => desc.north === maxNorthPreBend
        );

        const maxEastPreBend = Math.min(
            ...translatedDescriptions.map((desc) =>
                desc.east >= 18 ? desc.east : 1000
            )
        );
        const eastLimitBoundingBox = translatedDescriptions.find(
            (desc) => desc.east === maxEastPreBend
        );

        const maxSouthPreBend = Math.min(
            ...translatedDescriptions.map((desc) =>
                desc.south >= 14 ? desc.south : 1000
            )
        );
        const southLimitBoundingBox = translatedDescriptions.find(
            (desc) => desc.south === maxSouthPreBend
        );

        const maxWestPreBend = Math.max(
            ...translatedDescriptions.map((desc) =>
                desc.west <= -14 ? desc.west : -1000
            )
        );
        const westLimitBoundingBox = translatedDescriptions.find(
            (desc) => desc.west === maxWestPreBend
        );

        const newNorthOrigin = {
            x: northLimitBoundingBox.west,
            y: northLimitBoundingBox.north
        };

        const newEastOrigin = {
            x: eastLimitBoundingBox.east,
            y: eastLimitBoundingBox.north
        };

        const newSouthOrigin = {
            x: southLimitBoundingBox.east,
            y: southLimitBoundingBox.south
        };

        const newWestOrigin = {
            x: westLimitBoundingBox.west,
            y: westLimitBoundingBox.south
        };
        // console.log(newSouthOrigin);
        translatedDescriptions.forEach((desc, i) => {
            if (desc.south <= -14) {
                bentDescriptions.push({
                    ...desc,
                    north: newNorthOrigin.y - (desc.east - newNorthOrigin.x),
                    east: newNorthOrigin.x - (desc.north - newNorthOrigin.y),
                    south: newNorthOrigin.y - (desc.west - newNorthOrigin.x),
                    west: newNorthOrigin.x - (desc.south - newNorthOrigin.y),
                    direction: rotateDirection(desc.direction)
                });
            } else if (desc.north >= 14) {
                bentDescriptions.push({
                    ...desc,
                    north: newSouthOrigin.y - (desc.west - newSouthOrigin.x),
                    east: newSouthOrigin.x - (desc.south - newSouthOrigin.y),
                    south: newSouthOrigin.y - (desc.east - newSouthOrigin.x),
                    west: newSouthOrigin.x - (desc.north - newSouthOrigin.y),
                    direction: rotateDirection(desc.direction)
                });
                // Need to ensure we do this only if the spinner has been encountered here
            } else if (desc.west >= 18) {
                bentDescriptions.push({
                    ...desc,
                    north: newEastOrigin.y + (desc.east - newEastOrigin.x),
                    east: newEastOrigin.x + (desc.north - newEastOrigin.y),
                    south: newEastOrigin.y + (desc.west - newEastOrigin.x),
                    west: newEastOrigin.x + (desc.south - newEastOrigin.y),
                    direction: rotateDirection(desc.direction)
                });
            } else if (desc.east <= -14) {
                bentDescriptions.push({
                    ...desc,
                    north: newWestOrigin.y + (desc.west - newWestOrigin.x),
                    east: newWestOrigin.x + (desc.south - newWestOrigin.y),
                    south: newWestOrigin.y + (desc.east - newWestOrigin.x),
                    west: newWestOrigin.x + (desc.north - newWestOrigin.y),
                    direction: rotateDirection(desc.direction)
                });
            } else {
                bentDescriptions.push(desc);
            }
            //     // const northLimitBoundingBox = coordinatesToBoundingBoxes
            //     //     .get(desc.north)
            //     //     .get(4);
            //     // check for is double for the above box
            //     const newOrigin = {
            //         x: northLimitBoundingBox.west, // -1
            //         y: northLimitBoundingBox.north // -9
            //     };
            //     addValueToNestedMap(
            //         coordinatesToBoundingBoxes,
            //         desc.x, // 0
            //         desc.y, // 5
            //         {
            //             // -13 -> -11
            //             north:
            //                 newOrigin.y - (originalBoundingBox.east - newOrigin.x),
            //             // 1 -> 3
            //             east:
            //                 newOrigin.x - (originalBoundingBox.north - newOrigin.y),
            //             // -9 -> -9
            //             south:
            //                 newOrigin.y - (originalBoundingBox.west - newOrigin.x),
            //             // -1 -> -1
            //             west:
            //                 newOrigin.x - (originalBoundingBox.south - newOrigin.y),
            //             direction: rotateDirection(desc.direction)
            //         }
            //     );
            // }
        });
        console.log("bent:", bentDescriptions);
        return bentDescriptions;
    };

    const translatedDescriptions = translateDescriptionsToActualSizes(
        props.dominoDescriptions
    );
    // const bentDescriptions = translatedDescriptions;
    const bentDescriptions = bendDescriptions(translatedDescriptions);

    const westBoundary =
        Math.min(...bentDescriptions.map((desc) => desc.west)) - 3;
    const eastBoundary =
        Math.max(...bentDescriptions.map((desc) => desc.east)) + 2;
    const northBoundary =
        Math.min(...bentDescriptions.map((desc) => desc.north)) - 3;
    const southBoundary =
        Math.max(...bentDescriptions.map((desc) => desc.north)) + 2;
    const minGridWidthInSquares = eastBoundary - westBoundary;
    const minGridHeightInSquares = southBoundary - northBoundary;

    const availableHeight = window.innerHeight - 320;
    const availableWidth = window.innerWidth - 320;
    const limitingRatio = Math.min(
        availableHeight / minGridHeightInSquares,
        availableWidth / minGridWidthInSquares
    );
    const gridSizeInPixels = 2 * Math.round(limitingRatio / 2); // Math.max(2 * Math.round(500 / limitingRatio), 0);
    const gridWidthInSquares = availableWidth / gridSizeInPixels;
    const gridHeightInSquares = availableHeight / gridSizeInPixels;

    const gridHorizontalSquareMargin = Math.round(
        (gridWidthInSquares - minGridWidthInSquares) / 2
    );
    const gridVerticalSquareMargin = Math.round(
        (gridHeightInSquares - minGridHeightInSquares) / 2
    );

    const finalDescriptions = bentDescriptions.map((desc) => {
        return {
            ...desc,
            north: desc.north + gridVerticalSquareMargin - northBoundary,
            east: desc.east + gridHorizontalSquareMargin - westBoundary,
            south: desc.south + gridVerticalSquareMargin - northBoundary,
            west: desc.west + gridHorizontalSquareMargin - westBoundary
        };
    });
    console.log(finalDescriptions);

    return (
        <div
            className="board"
            style={{
                gridTemplateRows: `repeat(${Math.round(
                    availableHeight / gridSizeInPixels
                )}, ${
                    gridSizeInPixels + 1 // + 1 accounts for borders
                }px)`,
                gridTemplateColumns: `repeat(${Math.round(
                    availableWidth / gridSizeInPixels
                )}, ${
                    gridSizeInPixels + 1 // + 1 accounts for borders
                }px)`
            }}
        >
            {finalDescriptions.map((d, i) => {
                console.log();
                return (
                    <div
                        key={i}
                        style={{
                            gridArea: `${d.north} / ${d.west} / ${d.south} / ${d.east}`
                        }}
                    >
                        <Domino
                            face1={d.face1}
                            face2={d.face2}
                            direction={d.direction}
                            size={gridSizeInPixels * 2}
                        />
                    </div>
                );
            })}
            {/* <div style={{ gridRow: "4 / 6" }}>
                <Domino
                    face1={3}
                    face2={2}
                    direction={Direction.NORTH}
                    size={48}
                />
            </div>
            <div style={{ gridColumn: "7 / 9", gridRow: "6 / 7" }}>
                <Domino
                    face1={3}
                    face2={2}
                    direction={Direction.EAST}
                    size={48}
                />
            </div>
            <div style={{ gridColumn: "8 / 10", gridRow: "4 / 5" }}>
                <Domino
                    face1={3}
                    face2={2}
                    direction={Direction.WEST}
                    size={48}
                />
            </div>
            <div style={{ gridRow: "1 / 3" }}>
                <Domino
                    face1={3}
                    face2={2}
                    direction={Direction.SOUTH}
                    size={48}
                />
            </div> */}
        </div>
    );
    // }
};
