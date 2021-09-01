import { Direction } from "enums/Direction";
import React from "react";
import "./BoardView.css";
import { BoardDominoView } from "./BoardDominoView";
// import { BoardDominoDropArea } from "./BoardDominoDropArea";
import { DominoView } from "./DominoView";
import { IBoard } from "model/BoardModel";
import { observer } from "mobx-react-lite";
import { BoundingBox } from "interfaces/BoundingBox";
import { IBoardDomino } from "model/BoardDominoModel";

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
    const minVerticalBendThreshold = 8;

    const minHorizontalBendThreshold = 20;

    const findNorthBendThreshold = () => {
        const sortedDominoes = props.board.Dominoes.filter(
            (domino) =>
                domino.BoundingBox.South <= -1 * minVerticalBendThreshold
        ).sort((a, b) => b.BoundingBox.North - a.BoundingBox.North);
        for (let i = 0; i < sortedDominoes.length - 1; i++) {
            if (i < sortedDominoes.length - 1) {
                if (
                    !sortedDominoes[i].IsDouble &&
                    !sortedDominoes[i + 1].IsDouble
                ) {
                    return sortedDominoes[i].BoundingBox.North;
                }
            }
        }
        return -1000;
    };

    const findSouthBendThreshold = () => {
        const sortedDominoes = props.board.Dominoes.filter(
            (domino) => domino.BoundingBox.North >= minVerticalBendThreshold
        ).sort((a, b) => a.BoundingBox.North - b.BoundingBox.North);
        for (let i = 0; i < sortedDominoes.length - 1; i++) {
            if (i < sortedDominoes.length - 1) {
                if (
                    !sortedDominoes[i].IsDouble &&
                    !sortedDominoes[i + 1].IsDouble
                ) {
                    return sortedDominoes[i].BoundingBox.South;
                }
            }
        }
        return 1000;
    };

    const findEastBendThreshold = () => {
        const sortedDominoes = props.board.Dominoes.filter(
            (domino) => domino.BoundingBox.West >= minHorizontalBendThreshold
        ).sort((a, b) => a.BoundingBox.East - b.BoundingBox.East);
        for (let i = 0; i < sortedDominoes.length - 1; i++) {
            if (i < sortedDominoes.length - 1) {
                if (
                    !sortedDominoes[i].IsDouble &&
                    !sortedDominoes[i + 1].IsDouble
                ) {
                    return sortedDominoes[i].BoundingBox.East;
                }
            }
        }
        return 1000;
    };

    const findWestBendThreshold = () => {
        const sortedDominoes = props.board.Dominoes.filter(
            (domino) =>
                domino.BoundingBox.East <= -1 * minHorizontalBendThreshold
        ).sort((a, b) => b.BoundingBox.East - a.BoundingBox.East);
        for (let i = 0; i < sortedDominoes.length - 1; i++) {
            if (i < sortedDominoes.length - 1) {
                if (
                    !sortedDominoes[i].IsDouble &&
                    !sortedDominoes[i + 1].IsDouble
                ) {
                    return sortedDominoes[i].BoundingBox.West;
                }
            }
        }
        return -1000;
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

    const bendDominoes = (): {
        bentBoundingBoxes: BoundingBox[];
        bentDominoDirections: Direction[];
        dropAreaBoundingBoxes: Map<boolean, Map<Direction, BoundingBox>>;
    } => {
        if (props.board.BoundingBoxes.length === 0) {
            return {
                bentBoundingBoxes: [],
                bentDominoDirections: [],
                dropAreaBoundingBoxes: null
                // dropAreaBoundingBoxes: dropAreaBoundingBoxes
            };
        }

        const bentBoundingBoxes: BoundingBox[] = [];
        const bentDominoDirections: Direction[] = [];

        const northBendThreshold = findNorthBendThreshold();
        const eastBendThreshold = findEastBendThreshold();
        const southBendThreshold = findSouthBendThreshold();
        const westBendThreshold = findWestBendThreshold();

        const maxNorthPreBend = Math.max(
            ...props.board.BoundingBoxes.map((box) =>
                box.North <= northBendThreshold ? box.North : -1000
            )
        );
        const northLimitBoundingBox = props.board.BoundingBoxes.find(
            (desc) => desc.North === maxNorthPreBend
        );

        const maxEastPreBend = Math.min(
            ...props.board.BoundingBoxes.map((box) =>
                box.East >= eastBendThreshold ? box.East : 1000
            )
        );
        const eastLimitBoundingBox = props.board.BoundingBoxes.find(
            (desc) => desc.East === maxEastPreBend
        );

        const maxSouthPreBend = Math.min(
            ...props.board.BoundingBoxes.map((box) =>
                box.South >= southBendThreshold ? box.South : 1000
            )
        );
        const southLimitBoundingBox = props.board.BoundingBoxes.find(
            (desc) => desc.South === maxSouthPreBend
        );

        const maxWestPreBend = Math.max(
            ...props.board.BoundingBoxes.map((box) =>
                box.West <= westBendThreshold ? box.West : -1000
            )
        );
        const westLimitBoundingBox = props.board.BoundingBoxes.find(
            (desc) => desc.West === maxWestPreBend
        );

        const newNorthOrigin = northLimitBoundingBox
            ? {
                  x: northLimitBoundingBox.West,
                  y: northLimitBoundingBox.North
              }
            : null;

        const newEastOrigin = eastLimitBoundingBox
            ? {
                  x: eastLimitBoundingBox.East,
                  y: eastLimitBoundingBox.North
              }
            : null;

        const newSouthOrigin = southLimitBoundingBox
            ? {
                  x: southLimitBoundingBox.East,
                  y: southLimitBoundingBox.South
              }
            : null;

        const newWestOrigin = westLimitBoundingBox
            ? {
                  x: westLimitBoundingBox.West,
                  y: westLimitBoundingBox.South
              }
            : null;

        const generateNextBentDominoDescription = (domino: IBoardDomino) => {
            const box = domino.BoundingBox;
            if (box.South <= northBendThreshold) {
                return {
                    North: newNorthOrigin.y - (box.East - newNorthOrigin.x),
                    East: newNorthOrigin.x - (box.North - newNorthOrigin.y),
                    South: newNorthOrigin.y - (box.West - newNorthOrigin.x),
                    West: newNorthOrigin.x - (box.South - newNorthOrigin.y),
                    Direction: rotateDirection(domino.Direction)
                };
            } else if (box.North >= southBendThreshold) {
                return {
                    North: newSouthOrigin.y - (box.West - newSouthOrigin.x),
                    East: newSouthOrigin.x - (box.South - newSouthOrigin.y),
                    South: newSouthOrigin.y - (box.East - newSouthOrigin.x),
                    West: newSouthOrigin.x - (box.North - newSouthOrigin.y),
                    Direction: rotateDirection(domino.Direction)
                };
                // Need to ensure we do this only if the spinner has been encountered here
            } else if (box.West >= eastBendThreshold) {
                return {
                    North: newEastOrigin.y + (box.East - newEastOrigin.x),
                    East: newEastOrigin.x + (box.North - newEastOrigin.y),
                    South: newEastOrigin.y + (box.West - newEastOrigin.x),
                    West: newEastOrigin.x + (box.South - newEastOrigin.y),
                    Direction: rotateDirection(domino.Direction)
                };
            } else if (box.East <= westBendThreshold) {
                return {
                    North: newWestOrigin.y + (box.West - newWestOrigin.x),
                    East: newWestOrigin.x + (box.South - newWestOrigin.y),
                    South: newWestOrigin.y + (box.East - newWestOrigin.x),
                    West: newWestOrigin.x + (box.North - newWestOrigin.y),
                    Direction: rotateDirection(domino.Direction)
                };
            } else {
                return { ...box, Direction: domino.Direction };
            }
        };

        props.board.Dominoes.forEach((domino, i) => {
            const bentDominoDescription =
                generateNextBentDominoDescription(domino);
            bentBoundingBoxes.push({
                North: bentDominoDescription.North,
                South: bentDominoDescription.South,
                East: bentDominoDescription.East,
                West: bentDominoDescription.West
            } as BoundingBox);
            bentDominoDirections.push(bentDominoDescription.Direction);
        });

        // // Bend the drop area bounding boxes

        // const bentDropAreaBoundingBoxes = new Map<
        //     boolean,
        //     Map<Direction, IBoundingBox>
        // >();

        // bentDropAreaBoundingBoxes.set(false, new Map());
        // bentDropAreaBoundingBoxes.set(true, new Map());

        // [true, false].forEach((isDouble) => {
        //     const boundingBoxMap = dropAreaBoundingBoxes.get(isDouble);
        //     Array.from(boundingBoxMap.keys()).forEach((direction) => {
        //         const translatedBoundingBox = boundingBoxMap.get(direction);
        //         const mockDominoDescription = {
        //             north: translatedBoundingBox.north,
        //             east: translatedBoundingBox.east,
        //             south: translatedBoundingBox.south,
        //             west: translatedBoundingBox.west,
        //             face1: 0,
        //             face2: isDouble ? 0 : 1,
        //             direction: Direction.NONE // doesn't matter
        //         };
        //         bentDropAreaBoundingBoxes
        //             .get(isDouble)
        //             .set(
        //                 direction,
        //                 generateNextBentDominoDescription(mockDominoDescription)
        //             );
        //     });
        // });

        return {
            bentBoundingBoxes: bentBoundingBoxes,
            bentDominoDirections: bentDominoDirections,
            dropAreaBoundingBoxes: null
            // dropAreaBoundingBoxes: bentDropAreaBoundingBoxes
        };
    };

    let westBoundary;
    let eastBoundary;
    let northBoundary;
    let southBoundary;

    const bentDominoDescriptions = bendDominoes();

    const bentBoundingBoxes = bentDominoDescriptions.bentBoundingBoxes;
    const bentDominoDirections = bentDominoDescriptions.bentDominoDirections;
    const bentDropAreaDescriptions =
        bentDominoDescriptions.dropAreaBoundingBoxes;

    if (bentBoundingBoxes.length > 0) {
        westBoundary =
            Math.min(...bentBoundingBoxes.map((box) => box.West)) - 4;
        eastBoundary =
            Math.max(...bentBoundingBoxes.map((box) => box.East)) + 4;
        northBoundary =
            Math.min(...bentBoundingBoxes.map((box) => box.North)) - 4;
        southBoundary =
            Math.max(...bentBoundingBoxes.map((box) => box.South)) + 4;
    } else {
        westBoundary = -10;
        eastBoundary = 10;
        northBoundary = -10;
        southBoundary = 10;
    }

    const minGridWidthInSquares = eastBoundary - westBoundary;
    const minGridHeightInSquares = southBoundary - northBoundary;

    const limitingRatio = Math.min(
        props.height / minGridHeightInSquares,
        props.width / minGridWidthInSquares
    );
    // This will be used to determine how many squares there should be
    // The final size will be determined dynamically through css grid fractional sizing
    const gridSizeInPixels = Math.min(limitingRatio, 20);
    const gridWidthInSquares = Math.floor(props.width / gridSizeInPixels);
    const gridHeightInSquares = Math.floor(props.height / gridSizeInPixels);

    const gridHorizontalSquareMargin = Math.ceil(
        (gridWidthInSquares - minGridWidthInSquares) / 2
    );
    const gridVerticalSquareMargin = Math.ceil(
        (gridHeightInSquares - minGridHeightInSquares) / 2
    );

    const verticalShift = gridVerticalSquareMargin - northBoundary;
    const horizontalShift = gridHorizontalSquareMargin - westBoundary;
    console.log(bentBoundingBoxes);

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
                        north={bentBoundingBoxes[i].North + verticalShift}
                        east={bentBoundingBoxes[i].East + horizontalShift}
                        south={bentBoundingBoxes[i].South + verticalShift}
                        west={bentBoundingBoxes[i].West + horizontalShift}
                    >
                        <DominoView
                            face1={domino.Face1}
                            face2={domino.Face2}
                            direction={bentDominoDirections[i]}
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
