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
    const isDouble = (desc: DominoDescription): boolean => {
        return desc.face1 === desc.face2;
    };

    const translateDescriptionsToActualSizes = (
        descriptions: DominoDescription[]
    ): TranslatedDominoDescription[] => {
        const coordinatesToBoundingBoxes = new Map<
            number,
            Map<number, BoundingBoxDescription>
        >();

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
                                  (currentEastEdge.double ? 1 : 0),
                            east: boxAtEdge.west,
                            south: isDouble(desc)
                                ? boxAtEdge.south + 1
                                : boxAtEdge.south -
                                  (currentEastEdge.double ? 1 : 0),
                            west: isDouble(desc)
                                ? boxAtEdge.west - 2
                                : boxAtEdge.west - 4
                        }
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

        return newDescriptions;
    };

    const translatedDescriptions = translateDescriptionsToActualSizes(
        props.dominoDescriptions
    );
    const westBoundary =
        Math.min(...translatedDescriptions.map((desc) => desc.west)) - 3;
    const eastBoundary =
        Math.max(...translatedDescriptions.map((desc) => desc.east)) + 2;
    const northBoundary =
        Math.min(...translatedDescriptions.map((desc) => desc.north)) - 3;
    const southBoundary =
        Math.max(...translatedDescriptions.map((desc) => desc.north)) + 2;
    const minGridWidthInSquares = eastBoundary - westBoundary;
    const minGridHeightInSquares = southBoundary - northBoundary;

    const availableHeight = window.innerHeight - 290;
    const availableWidth = window.innerWidth - 290;
    const limitingRatio = Math.min(
        availableHeight / minGridHeightInSquares,
        availableWidth / minGridWidthInSquares
    );
    const dominoSize = Math.max(2 * Math.round(500 / limitingRatio), 20);
    const gridWidthInSquares = (2 * availableWidth) / dominoSize;
    const gridHeightInSquares = (2 * availableHeight) / dominoSize;

    const gridHorizontalSquareMargin = Math.round(
        (gridWidthInSquares - minGridWidthInSquares) / 2
    );
    const gridVerticalSquareMargin = Math.round(
        (gridHeightInSquares - minGridHeightInSquares) / 2
    );

    const finalDescriptions = translatedDescriptions.map((desc) => {
        return {
            ...desc,
            north: desc.north + gridVerticalSquareMargin - northBoundary,
            east: desc.east + gridHorizontalSquareMargin - westBoundary,
            south: desc.south + gridVerticalSquareMargin - northBoundary,
            west: desc.west + gridHorizontalSquareMargin - westBoundary
        };
    });

    return (
        <div
            className="board"
            style={{
                gridTemplateRows: `repeat(${Math.round(
                    (2 * availableHeight) / dominoSize
                )}, ${
                    dominoSize / 2 + 1 // + 1 accounts for borders
                }px)`,
                gridTemplateColumns: `repeat(${Math.round(
                    (2 * availableWidth) / dominoSize
                )}, ${
                    dominoSize / 2 + 1 // + 1 accounts for borders
                }px)`
            }}
        >
            {finalDescriptions.map((d, i) => {
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
                            size={dominoSize}
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
