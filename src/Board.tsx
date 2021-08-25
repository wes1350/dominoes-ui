import React from "react";
import "./Board.css";
import { BoardDomino } from "./BoardDomino";
import { BoardDominoDropArea } from "./BoardDominoDropArea";
import { Domino } from "./Domino";
import { DominoDescription } from "./DominoDescription";
import { Direction } from "./Enums";

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
    onDropDomino: (
        dominoFaces: { face1: number; face2: number },
        direction: Direction
    ) => void;
    dominoBeingDragged: DominoDescription;
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

    // Keep track of coordinates of the most extreme dominoes in each direction
    // For north/south, this will originate with the spinner
    let currentNorthEdge: CoordinateDescription = null;
    let currentEastEdge: CoordinateDescription = null;
    let currentSouthEdge: CoordinateDescription = null;
    let currentWestEdge: CoordinateDescription = null;

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

    const generateNextTranslatedDominoDescription = (
        existingTranslatedDescriptions: TranslatedDominoDescription[],
        desc: DominoDescription,
        onlyCalculate?: boolean
    ): TranslatedDominoDescription => {
        let currentBoundingBox;
        if (existingTranslatedDescriptions.length === 0) {
            // first domino is always at 0, 0
            if (isDouble(desc)) {
                currentBoundingBox = {
                    north: -2,
                    east: 1,
                    south: 2,
                    west: -1
                };

                if (!onlyCalculate) {
                    addValueToNestedMap(
                        coordinatesToBoundingBoxes,
                        0,
                        0,
                        currentBoundingBox
                    );
                    addValueToNestedMap(coordinatesToIsDouble, 0, 0, true);

                    currentNorthEdge = { x: 0, y: 0, double: true };
                    currentEastEdge = { x: 0, y: 0, double: true };
                    currentSouthEdge = { x: 0, y: 0, double: true };
                    currentWestEdge = { x: 0, y: 0, double: true };
                }
            } else {
                currentBoundingBox = {
                    north: -1,
                    east: 2,
                    south: 1,
                    west: -2
                };
                if (!onlyCalculate) {
                    addValueToNestedMap(
                        coordinatesToBoundingBoxes,
                        0,
                        0,
                        currentBoundingBox
                    );
                    addValueToNestedMap(coordinatesToIsDouble, 0, 0, false);
                    currentEastEdge = { x: 0, y: 0, double: false };
                    currentWestEdge = { x: 0, y: 0, double: false };
                    // this is not the spinner, so don't set the north/south edges
                }
            }
        } else {
            if (isDouble(desc) && !currentNorthEdge) {
                if (!onlyCalculate) {
                    // This is the spinner, set the north/south edges properly
                    currentNorthEdge = { x: desc.x, y: 0, double: true };
                    currentSouthEdge = { x: desc.x, y: 0, double: true };
                }
            }

            if (desc.y > 0) {
                // adding on north side
                const boxAtEdge = coordinatesToBoundingBoxes
                    .get(currentNorthEdge.x)
                    .get(currentNorthEdge.y);

                currentBoundingBox = {
                    north: isDouble(desc)
                        ? boxAtEdge.north - 2
                        : boxAtEdge.north - 4,
                    east: isDouble(desc)
                        ? boxAtEdge.east + 1
                        : boxAtEdge.east -
                          (currentNorthEdge.double && currentNorthEdge.y !== 0
                              ? 1
                              : 0),
                    south: boxAtEdge.north,
                    west: isDouble(desc)
                        ? boxAtEdge.west - 1
                        : boxAtEdge.west +
                          (currentNorthEdge.double && currentNorthEdge.y !== 0
                              ? 1
                              : 0)
                };

                if (!onlyCalculate) {
                    addValueToNestedMap(
                        coordinatesToBoundingBoxes,
                        desc.x,
                        desc.y,
                        currentBoundingBox
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
                }
            } else if (desc.y < 0) {
                // adding on south side
                const boxAtEdge = coordinatesToBoundingBoxes
                    .get(currentSouthEdge.x)
                    .get(currentSouthEdge.y);

                currentBoundingBox = {
                    north: boxAtEdge.south,
                    east: isDouble(desc)
                        ? boxAtEdge.east + 1
                        : boxAtEdge.east -
                          (currentSouthEdge.double && currentSouthEdge.y !== 0
                              ? 1
                              : 0),
                    south: isDouble(desc)
                        ? boxAtEdge.south + 2
                        : boxAtEdge.south + 4,
                    west: isDouble(desc)
                        ? boxAtEdge.west - 1
                        : boxAtEdge.west +
                          (currentSouthEdge.double && currentSouthEdge.y !== 0
                              ? 1
                              : 0)
                };

                if (!onlyCalculate) {
                    addValueToNestedMap(
                        coordinatesToBoundingBoxes,
                        desc.x,
                        desc.y,
                        currentBoundingBox
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
                }
            } else if (desc.x > 0) {
                // adding on east side
                const boxAtEdge = coordinatesToBoundingBoxes
                    .get(currentEastEdge.x)
                    .get(currentEastEdge.y);

                currentBoundingBox = {
                    north: isDouble(desc)
                        ? boxAtEdge.north - 1
                        : boxAtEdge.north + (currentEastEdge.double ? 1 : 0),
                    east: isDouble(desc)
                        ? boxAtEdge.east + 2
                        : boxAtEdge.east + 4,
                    south: isDouble(desc)
                        ? boxAtEdge.south + 1
                        : boxAtEdge.south - (currentEastEdge.double ? 1 : 0),
                    west: boxAtEdge.east
                };

                if (!onlyCalculate) {
                    addValueToNestedMap(
                        coordinatesToBoundingBoxes,
                        desc.x,
                        desc.y,
                        currentBoundingBox
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
                }
            } else if (desc.x < 0) {
                // adding on west side
                const boxAtEdge = coordinatesToBoundingBoxes
                    .get(currentWestEdge.x)
                    .get(currentWestEdge.y);

                currentBoundingBox = {
                    north: isDouble(desc)
                        ? boxAtEdge.north - 1
                        : boxAtEdge.north + (currentWestEdge.double ? 1 : 0),
                    east: boxAtEdge.west,
                    south: isDouble(desc)
                        ? boxAtEdge.south + 1
                        : boxAtEdge.south - (currentWestEdge.double ? 1 : 0),
                    west: isDouble(desc)
                        ? boxAtEdge.west - 2
                        : boxAtEdge.west - 4
                };
                if (!onlyCalculate) {
                    addValueToNestedMap(
                        coordinatesToBoundingBoxes,
                        desc.x,
                        desc.y,
                        currentBoundingBox
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
        }

        return {
            ...desc,
            north: currentBoundingBox.north,
            east: currentBoundingBox.east,
            south: currentBoundingBox.south,
            west: currentBoundingBox.west
        };
    };

    const generateDropAreaBoundingBoxDescriptions = (
        descriptions: TranslatedDominoDescription[]
    ) => {
        // Mimic domino descriptions for determining drop area bounding boxes
        const dropAreaDescriptions = new Map<
            boolean,
            Map<Direction, BoundingBoxDescription>
        >();
        dropAreaDescriptions.set(false, new Map());
        dropAreaDescriptions.set(true, new Map());

        if (descriptions.length === 0) {
            [true, false].forEach((isDouble) => {
                const mockDominoDescription = {
                    face1: 0,
                    face2: isDouble ? 0 : 1,
                    direction: Direction.NONE,
                    x: 0,
                    y: 0
                };
                dropAreaDescriptions
                    .get(isDouble)
                    .set(
                        Direction.NONE,
                        generateNextTranslatedDominoDescription(
                            descriptions,
                            mockDominoDescription,
                            true
                        )
                    );
            });
        } else {
            [true, false].forEach((isDouble) => {
                if (currentEastEdge) {
                    const mockDominoDescription = {
                        face1: 0,
                        face2: isDouble ? 0 : 1,
                        direction: Direction.NONE, // not used
                        x: currentEastEdge.x + 1,
                        y: 0
                    };
                    const desc = generateNextTranslatedDominoDescription(
                        descriptions,
                        mockDominoDescription,
                        true
                    );
                    dropAreaDescriptions
                        .get(isDouble)
                        .set(Direction.EAST, desc);
                }
                if (currentWestEdge) {
                    const mockDominoDescription = {
                        face1: 0,
                        face2: isDouble ? 0 : 1,
                        direction: Direction.NONE, // not used
                        x: currentWestEdge.x - 1,
                        y: 0
                    };
                    dropAreaDescriptions
                        .get(isDouble)
                        .set(
                            Direction.WEST,
                            generateNextTranslatedDominoDescription(
                                descriptions,
                                mockDominoDescription,
                                true
                            )
                        );
                }
                if (currentNorthEdge) {
                    const mockDominoDescription = {
                        face1: 0,
                        face2: isDouble ? 0 : 1,
                        direction: Direction.NONE, // not used
                        x: currentNorthEdge.x,
                        y: currentNorthEdge.y + 1
                    };

                    dropAreaDescriptions
                        .get(isDouble)
                        .set(
                            Direction.NORTH,
                            generateNextTranslatedDominoDescription(
                                descriptions,
                                mockDominoDescription,
                                true
                            )
                        );
                }
                if (currentSouthEdge) {
                    const mockDominoDescription = {
                        face1: 0,
                        face2: isDouble ? 0 : 1,
                        direction: Direction.NONE, // not used
                        x: currentSouthEdge.x,
                        y: currentSouthEdge.y - 1
                    };
                    dropAreaDescriptions
                        .get(isDouble)
                        .set(
                            Direction.SOUTH,
                            generateNextTranslatedDominoDescription(
                                descriptions,
                                mockDominoDescription,
                                true
                            )
                        );
                }
            });
        }

        return dropAreaDescriptions;
    };

    const translateDescriptionsToActualSizes = (
        descriptions: DominoDescription[]
    ): {
        descriptions: TranslatedDominoDescription[];
        dropAreaBoundingBoxes: Map<
            boolean,
            Map<Direction, BoundingBoxDescription>
        >;
    } => {
        const newDescriptions: TranslatedDominoDescription[] = [];

        descriptions.forEach((desc) => {
            newDescriptions.push(
                generateNextTranslatedDominoDescription(newDescriptions, desc)
            );
        });

        // Now that the descriptions have been translated, determine the possible drop area coordinates
        const dropAreaBoundingBoxes =
            generateDropAreaBoundingBoxDescriptions(newDescriptions);

        return {
            descriptions: newDescriptions,
            dropAreaBoundingBoxes: dropAreaBoundingBoxes
        };
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
        return -1000;
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
        return 1000;
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
        return 1000;
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
        return -1000;
    };

    const bendDescriptions = (
        descriptions: TranslatedDominoDescription[],
        dropAreaBoundingBoxes: Map<
            boolean,
            Map<Direction, BoundingBoxDescription>
        >
    ): {
        descriptions: TranslatedDominoDescription[];
        dropAreaBoundingBoxes: Map<
            boolean,
            Map<Direction, BoundingBoxDescription>
        >;
    } => {
        if (descriptions.length === 0) {
            return {
                descriptions: [],
                dropAreaBoundingBoxes: dropAreaBoundingBoxes
            };
        }

        const bentDescriptions: TranslatedDominoDescription[] = [];

        const northBendThreshold = findNorthBendThreshold(descriptions);
        const eastBendThreshold = findEastBendThreshold(descriptions);
        const southBendThreshold = findSouthBendThreshold(descriptions);
        const westBendThreshold = findWestBendThreshold(descriptions);

        const maxNorthPreBend = Math.max(
            ...descriptions.map((desc) =>
                desc.north <= northBendThreshold ? desc.north : -1000
            )
        );
        const northLimitBoundingBox = descriptions.find(
            (desc) => desc.north === maxNorthPreBend
        );

        const maxEastPreBend = Math.min(
            ...descriptions.map((desc) =>
                desc.east >= eastBendThreshold ? desc.east : 1000
            )
        );
        const eastLimitBoundingBox = descriptions.find(
            (desc) => desc.east === maxEastPreBend
        );

        const maxSouthPreBend = Math.min(
            ...descriptions.map((desc) =>
                desc.south >= southBendThreshold ? desc.south : 1000
            )
        );
        const southLimitBoundingBox = descriptions.find(
            (desc) => desc.south === maxSouthPreBend
        );

        const maxWestPreBend = Math.max(
            ...descriptions.map((desc) =>
                desc.west <= westBendThreshold ? desc.west : -1000
            )
        );
        const westLimitBoundingBox = descriptions.find(
            (desc) => desc.west === maxWestPreBend
        );

        const newNorthOrigin = northLimitBoundingBox
            ? {
                  x: northLimitBoundingBox.west,
                  y: northLimitBoundingBox.north
              }
            : null;

        const newEastOrigin = eastLimitBoundingBox
            ? {
                  x: eastLimitBoundingBox.east,
                  y: eastLimitBoundingBox.north
              }
            : null;

        const newSouthOrigin = southLimitBoundingBox
            ? {
                  x: southLimitBoundingBox.east,
                  y: southLimitBoundingBox.south
              }
            : null;

        const newWestOrigin = westLimitBoundingBox
            ? {
                  x: westLimitBoundingBox.west,
                  y: westLimitBoundingBox.south
              }
            : null;

        const generateNextBentDominoDescription = (
            desc: TranslatedDominoDescription
        ) => {
            if (desc.south <= northBendThreshold) {
                return {
                    ...desc,
                    north: newNorthOrigin.y - (desc.east - newNorthOrigin.x),
                    east: newNorthOrigin.x - (desc.north - newNorthOrigin.y),
                    south: newNorthOrigin.y - (desc.west - newNorthOrigin.x),
                    west: newNorthOrigin.x - (desc.south - newNorthOrigin.y),
                    direction: rotateDirection(desc.direction)
                };
            } else if (desc.north >= southBendThreshold) {
                return {
                    ...desc,
                    north: newSouthOrigin.y - (desc.west - newSouthOrigin.x),
                    east: newSouthOrigin.x - (desc.south - newSouthOrigin.y),
                    south: newSouthOrigin.y - (desc.east - newSouthOrigin.x),
                    west: newSouthOrigin.x - (desc.north - newSouthOrigin.y),
                    direction: rotateDirection(desc.direction)
                };
                // Need to ensure we do this only if the spinner has been encountered here
            } else if (desc.west >= eastBendThreshold) {
                return {
                    ...desc,
                    north: newEastOrigin.y + (desc.east - newEastOrigin.x),
                    east: newEastOrigin.x + (desc.north - newEastOrigin.y),
                    south: newEastOrigin.y + (desc.west - newEastOrigin.x),
                    west: newEastOrigin.x + (desc.south - newEastOrigin.y),
                    direction: rotateDirection(desc.direction)
                };
            } else if (desc.east <= westBendThreshold) {
                return {
                    ...desc,
                    north: newWestOrigin.y + (desc.west - newWestOrigin.x),
                    east: newWestOrigin.x + (desc.south - newWestOrigin.y),
                    south: newWestOrigin.y + (desc.east - newWestOrigin.x),
                    west: newWestOrigin.x + (desc.north - newWestOrigin.y),
                    direction: rotateDirection(desc.direction)
                };
            } else {
                return desc;
            }
        };

        descriptions.forEach((desc, i) => {
            bentDescriptions.push(generateNextBentDominoDescription(desc));
        });

        // Bend the drop area bounding boxes

        const bentDropAreaBoundingBoxes = new Map<
            boolean,
            Map<Direction, BoundingBoxDescription>
        >();

        bentDropAreaBoundingBoxes.set(false, new Map());
        bentDropAreaBoundingBoxes.set(true, new Map());

        [true, false].forEach((isDouble) => {
            const boundingBoxMap = dropAreaBoundingBoxes.get(isDouble);
            Array.from(boundingBoxMap.keys()).forEach((direction) => {
                const translatedBoundingBox = boundingBoxMap.get(direction);
                const mockDominoDescription = {
                    north: translatedBoundingBox.north,
                    east: translatedBoundingBox.east,
                    south: translatedBoundingBox.south,
                    west: translatedBoundingBox.west,
                    face1: 0,
                    face2: isDouble ? 0 : 1,
                    direction: Direction.NONE // doesn't matter
                };
                bentDropAreaBoundingBoxes
                    .get(isDouble)
                    .set(
                        direction,
                        generateNextBentDominoDescription(mockDominoDescription)
                    );
            });
        });

        return {
            descriptions: bentDescriptions,
            dropAreaBoundingBoxes: bentDropAreaBoundingBoxes
        };
    };

    const translatedDescriptions = translateDescriptionsToActualSizes(
        props.dominoDescriptions
    );

    const bentDescriptions = bendDescriptions(
        translatedDescriptions.descriptions,
        translatedDescriptions.dropAreaBoundingBoxes
    );

    const bentDominoDescriptions = bentDescriptions.descriptions;
    const bentDropAreaDescriptions = bentDescriptions.dropAreaBoundingBoxes;

    let westBoundary;
    let eastBoundary;
    let northBoundary;
    let southBoundary;

    if (bentDominoDescriptions.length > 0) {
        westBoundary =
            Math.min(...bentDominoDescriptions.map((desc) => desc.west)) - 4;
        eastBoundary =
            Math.max(...bentDominoDescriptions.map((desc) => desc.east)) + 4;
        northBoundary =
            Math.min(...bentDominoDescriptions.map((desc) => desc.north)) - 4;
        southBoundary =
            Math.max(...bentDominoDescriptions.map((desc) => desc.north)) + 4;
    } else {
        westBoundary = -10;
        eastBoundary = 10;
        northBoundary = -10;
        southBoundary = 10;
    }

    const minGridWidthInSquares = eastBoundary - westBoundary;
    const minGridHeightInSquares = southBoundary - northBoundary;

    const availableHeight = window.innerHeight - 300;
    const availableWidth = window.innerWidth - 300;
    const limitingRatio = Math.min(
        availableHeight / minGridHeightInSquares,
        availableWidth / minGridWidthInSquares
    );
    const gridSizeInPixels = Math.min(2 * Math.floor(limitingRatio / 2), 20);
    const gridWidthInSquares = availableWidth / gridSizeInPixels;
    const gridHeightInSquares = availableHeight / gridSizeInPixels;

    const gridHorizontalSquareMargin = Math.round(
        (gridWidthInSquares - minGridWidthInSquares) / 2
    );
    const gridVerticalSquareMargin = Math.round(
        (gridHeightInSquares - minGridHeightInSquares) / 2
    );

    const northShift = gridVerticalSquareMargin - northBoundary;
    const eastShift = gridHorizontalSquareMargin - westBoundary;
    const southShift = gridVerticalSquareMargin - northBoundary;
    const westShift = gridHorizontalSquareMargin - westBoundary;

    const finalDominoDescriptions = bentDominoDescriptions.map((desc) => {
        return {
            ...desc,
            north: desc.north + northShift,
            east: desc.east + eastShift,
            south: desc.south + southShift,
            west: desc.west + westShift
        };
    });
    console.log(finalDominoDescriptions);

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
            {finalDominoDescriptions.map((d, i) => {
                return (
                    <BoardDomino
                        key={i}
                        north={d.north}
                        east={d.east}
                        south={d.south}
                        west={d.west}
                    >
                        <Domino
                            face1={d.face1}
                            face2={d.face2}
                            direction={d.direction}
                            size={gridSizeInPixels * 2}
                        />
                    </BoardDomino>
                );
            })}
            {Array.from(bentDropAreaDescriptions.get(false).keys()).map(
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
                                props.dominoBeingDragged
                                    ? !isDouble(props.dominoBeingDragged)
                                    : false
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
                                props.dominoBeingDragged
                                    ? isDouble(props.dominoBeingDragged)
                                    : false
                            }
                        ></BoardDominoDropArea>
                    );
                }
            )}
        </div>
    );
};
