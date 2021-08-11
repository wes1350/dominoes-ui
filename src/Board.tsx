import React from "react";
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

    const minVerticalBendThreshold = 8;
    const minHorizontalBendThreshold = 20;

    const findNorthBendThreshold = (
        translatedDescriptions: TranslatedDominoDescription[]
    ) => {
        const sortedDescriptions = translatedDescriptions
            .filter((desc) => desc.south <= -1 * minVerticalBendThreshold)
            .sort((a, b) => b.north - a.north);
        for (let i = 0; i < sortedDescriptions.length - 1; i++) {
            const desc = sortedDescriptions[i];
            if (i < sortedDescriptions.length - 1) {
                if (!isDouble(desc) && !isDouble(sortedDescriptions[i + 1])) {
                    return desc.north;
                }
            }
        }
        return -1 * minVerticalBendThreshold;
    };

    const findSouthBendThreshold = (
        translatedDescriptions: TranslatedDominoDescription[]
    ) => {
        const sortedDescriptions = translatedDescriptions
            .filter((desc) => desc.north >= minVerticalBendThreshold)
            .sort((a, b) => a.north - b.north);
        for (let i = 0; i < sortedDescriptions.length - 1; i++) {
            const desc = sortedDescriptions[i];
            if (i < sortedDescriptions.length - 1) {
                if (!isDouble(desc) && !isDouble(sortedDescriptions[i + 1])) {
                    return desc.south;
                }
            }
        }
        return minVerticalBendThreshold;
    };

    const findEastBendThreshold = (
        translatedDescriptions: TranslatedDominoDescription[]
    ) => {
        const sortedDescriptions = translatedDescriptions
            .filter((desc) => desc.west >= minHorizontalBendThreshold)
            .sort((a, b) => a.east - b.east);
        for (let i = 0; i < sortedDescriptions.length - 1; i++) {
            const desc = sortedDescriptions[i];
            if (i < sortedDescriptions.length - 1) {
                if (!isDouble(desc) && !isDouble(sortedDescriptions[i + 1])) {
                    return desc.east;
                }
            }
        }
        return minHorizontalBendThreshold;
    };

    const findWestBendThreshold = (
        translatedDescriptions: TranslatedDominoDescription[]
    ) => {
        const sortedDescriptions = translatedDescriptions
            .filter((desc) => desc.east <= -1 * minHorizontalBendThreshold)
            .sort((a, b) => b.east - a.east);
        for (let i = 0; i < sortedDescriptions.length - 1; i++) {
            const desc = sortedDescriptions[i];
            if (i < sortedDescriptions.length - 1) {
                if (!isDouble(desc) && !isDouble(sortedDescriptions[i + 1])) {
                    return desc.west;
                }
            }
        }
        return -1 * minHorizontalBendThreshold;
    };

    const bendDescriptions = (
        translatedDescriptions: TranslatedDominoDescription[]
    ): TranslatedDominoDescription[] => {
        if (translatedDescriptions.length === 0) {
            return [];
        }

        const bentDescriptions: TranslatedDominoDescription[] = [];

        console.log(findNorthBendThreshold(translatedDescriptions));
        console.log(findEastBendThreshold(translatedDescriptions));
        console.log(findSouthBendThreshold(translatedDescriptions));
        console.log(findWestBendThreshold(translatedDescriptions));

        const northBendThreshold = findNorthBendThreshold(
            translatedDescriptions
        );
        const eastBendThreshold = findEastBendThreshold(translatedDescriptions);
        const southBendThreshold = findSouthBendThreshold(
            translatedDescriptions
        );
        const westBendThreshold = findWestBendThreshold(translatedDescriptions);

        const maxNorthPreBend = Math.max(
            ...translatedDescriptions.map((desc) =>
                desc.north <= northBendThreshold ? desc.north : -1000
            )
        );
        const northLimitBoundingBox = translatedDescriptions.find(
            (desc) => desc.north === maxNorthPreBend
        );

        const maxEastPreBend = Math.min(
            ...translatedDescriptions.map((desc) =>
                desc.east >= eastBendThreshold ? desc.east : 1000
            )
        );
        const eastLimitBoundingBox = translatedDescriptions.find(
            (desc) => desc.east === maxEastPreBend
        );

        const maxSouthPreBend = Math.min(
            ...translatedDescriptions.map((desc) =>
                desc.south >= southBendThreshold ? desc.south : 1000
            )
        );
        const southLimitBoundingBox = translatedDescriptions.find(
            (desc) => desc.south === maxSouthPreBend
        );

        const maxWestPreBend = Math.max(
            ...translatedDescriptions.map((desc) =>
                desc.west <= westBendThreshold ? desc.west : -1000
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
            if (desc.south <= northBendThreshold) {
                bentDescriptions.push({
                    ...desc,
                    north: newNorthOrigin.y - (desc.east - newNorthOrigin.x),
                    east: newNorthOrigin.x - (desc.north - newNorthOrigin.y),
                    south: newNorthOrigin.y - (desc.west - newNorthOrigin.x),
                    west: newNorthOrigin.x - (desc.south - newNorthOrigin.y),
                    direction: rotateDirection(desc.direction)
                });
            } else if (desc.north >= southBendThreshold) {
                bentDescriptions.push({
                    ...desc,
                    north: newSouthOrigin.y - (desc.west - newSouthOrigin.x),
                    east: newSouthOrigin.x - (desc.south - newSouthOrigin.y),
                    south: newSouthOrigin.y - (desc.east - newSouthOrigin.x),
                    west: newSouthOrigin.x - (desc.north - newSouthOrigin.y),
                    direction: rotateDirection(desc.direction)
                });
                // Need to ensure we do this only if the spinner has been encountered here
            } else if (desc.west >= eastBendThreshold) {
                bentDescriptions.push({
                    ...desc,
                    north: newEastOrigin.y + (desc.east - newEastOrigin.x),
                    east: newEastOrigin.x + (desc.north - newEastOrigin.y),
                    south: newEastOrigin.y + (desc.west - newEastOrigin.x),
                    west: newEastOrigin.x + (desc.south - newEastOrigin.y),
                    direction: rotateDirection(desc.direction)
                });
            } else if (desc.east <= westBendThreshold) {
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
        });
        console.log("bent:", bentDescriptions);
        return bentDescriptions;
    };

    const translatedDescriptions = translateDescriptionsToActualSizes(
        props.dominoDescriptions
    );
    const bentDescriptions = bendDescriptions(translatedDescriptions);

    const westBoundary =
        Math.min(...bentDescriptions.map((desc) => desc.west)) - 1;
    const eastBoundary =
        Math.max(...bentDescriptions.map((desc) => desc.east)) + 0;
    const northBoundary =
        Math.min(...bentDescriptions.map((desc) => desc.north)) - 1;
    const southBoundary =
        Math.max(...bentDescriptions.map((desc) => desc.north)) + 0;
    const minGridWidthInSquares = eastBoundary - westBoundary;
    const minGridHeightInSquares = southBoundary - northBoundary;

    const availableHeight = window.innerHeight - 300;
    const availableWidth = window.innerWidth - 300;
    const limitingRatio = Math.min(
        availableHeight / minGridHeightInSquares,
        availableWidth / minGridWidthInSquares
    );
    const gridSizeInPixels = 2 * Math.floor(limitingRatio / 2);
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
                gridTemplateRows: `repeat(${Math.floor(
                    availableHeight / gridSizeInPixels
                )}, ${
                    gridSizeInPixels + 1 // + 1 accounts for borders
                }px)`,
                gridTemplateColumns: `repeat(${Math.floor(
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
        </div>
    );
};
