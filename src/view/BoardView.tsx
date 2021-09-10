import { Direction } from "enums/Direction";
import React from "react";
import "./BoardView.css";
import { BoardDominoView } from "./BoardDominoView";
import { DominoView } from "./DominoView";
import { IBoard } from "model/BoardModel";
import { observer } from "mobx-react-lite";
import { BoundingBox } from "interfaces/BoundingBox";
import { IBoardDomino } from "model/BoardDominoModel";
import { rotateDirectionClockwise } from "utils/utils";

interface IProps {
    board: IBoard;
    width: number;
    height: number;
    onDropDomino: (item: { index: number }, direction: Direction) => void;
    dominoBeingDragged: IBoardDomino;
}

export const BoardView = observer((props: IProps) => {
    // Have some condition to not render the board or something if the screen is too small
    // Can we just arbitrarily scale everything though?

    const boundingBoxFitsInGrid = (
        boundingBox: BoundingBox,
        gridWidth: number,
        gridHeight: number
    ): boolean => {
        return (
            boundingBox.North >= 0 &&
            boundingBox.West >= 0 &&
            boundingBox.East <= gridWidth &&
            boundingBox.South <= gridHeight
        );
    };

    const bendBoundingBoxAroundPoint = (
        box: BoundingBox,
        x: number,
        y: number,
        direction: Direction,
        aroundDouble: boolean
    ): BoundingBox => {
        // When bending a non-double around a double, cannot just reflect around the same point, needs some shifting
        const parallelAxisAdjustmentForDoubles = aroundDouble ? -1 : 0;
        const perpendicularAxisAdjustmentForDoubles = aroundDouble ? 2 : 0;

        if (direction === Direction.NORTH) {
            return {
                North: y - (box.East - x) - parallelAxisAdjustmentForDoubles,
                East:
                    x - (box.North - y) + perpendicularAxisAdjustmentForDoubles,
                South: y - (box.West - x) - parallelAxisAdjustmentForDoubles,
                West:
                    x - (box.South - y) + perpendicularAxisAdjustmentForDoubles
            };
        } else if (direction === Direction.SOUTH) {
            return {
                North: y - (box.West - x) + parallelAxisAdjustmentForDoubles,
                East:
                    x - (box.South - y) - perpendicularAxisAdjustmentForDoubles,
                South: y - (box.East - x) + parallelAxisAdjustmentForDoubles,
                West:
                    x - (box.North - y) - perpendicularAxisAdjustmentForDoubles
            };
            // Need to ensure we do this only if the spinner has been encountered here
        } else if (direction === Direction.EAST) {
            return {
                North:
                    y + (box.East - x) + perpendicularAxisAdjustmentForDoubles,
                East: x + (box.North - y) + parallelAxisAdjustmentForDoubles,
                South:
                    y + (box.West - x) + perpendicularAxisAdjustmentForDoubles,
                West: x + (box.South - y) + parallelAxisAdjustmentForDoubles
            };
        } else if (direction === Direction.WEST) {
            return {
                North:
                    y + (box.West - x) - perpendicularAxisAdjustmentForDoubles,
                East: x + (box.South - y) - parallelAxisAdjustmentForDoubles,
                South:
                    y + (box.East - x) - perpendicularAxisAdjustmentForDoubles,
                West: x + (box.North - y) - parallelAxisAdjustmentForDoubles
            };
        }
    };

    const layoutDominoes = (
        gridWidthInPixels: number,
        gridHeightInPixels: number,
        board: IBoard
    ): {
        gridWidthInSquares: number;
        gridHeightInSquares: number;
        gridSquarePixelSize: number;
        boundingBoxes: BoundingBox[];
        dominoOrientationDirections: Direction[];
    } => {
        const boundingBoxes = board.Dominoes.map(
            (domino) => domino.BoundingBox
        );
        const baseDominoLayoutHorizontalSpan =
            board.RenderedEastBoundary - board.RenderedWestBoundary;
        const baseDominoLayoutVerticalSpan =
            board.RenderedSouthBoundary - board.RenderedNorthBoundary;

        // i = number of resizings so far
        let i = 0;

        while (true) {
            if (i >= 10) {
                throw new Error("Could not resolve grid layout, fatal error");
            }

            const F = 1 / (6 * i + 24);

            const minimumDimension = Math.min(
                gridWidthInPixels,
                gridHeightInPixels
            );
            const gridSquarePixelSize = F * minimumDimension;
            const gridWidthInSquares = Math.floor(
                gridWidthInPixels / gridSquarePixelSize
            );
            const gridHeightInSquares = Math.floor(
                gridHeightInPixels / gridSquarePixelSize
            );

            // Grid starts at (0, 0), shift by (1, 1) to conform to CSS-grid outside of this function
            const gridSquareHorizontalCenter = Math.floor(
                gridWidthInSquares / 2
            );
            const gridSquareVerticalCenter = Math.floor(
                gridHeightInSquares / 2
            );

            const baseDominoLayoutHorizontalCenter =
                (board.RenderedEastBoundary + board.RenderedWestBoundary) / 2;
            const baseDominoLayoutVerticalCenter =
                (board.RenderedNorthBoundary + board.RenderedSouthBoundary) / 2;

            const horizontalShift =
                gridSquareHorizontalCenter - baseDominoLayoutHorizontalCenter;
            const verticalShift =
                gridSquareVerticalCenter - baseDominoLayoutVerticalCenter;

            const translatedBoundingBoxes = boundingBoxes.map(
                (box) =>
                    ({
                        North: box.North + verticalShift,
                        East: box.East + horizontalShift,
                        South: box.South + verticalShift,
                        West: box.West + horizontalShift
                    } as BoundingBox)
            );

            if (i === 0) {
                // Check if the board fits at the base size, without bending
                if (
                    baseDominoLayoutVerticalSpan <= gridHeightInSquares &&
                    baseDominoLayoutHorizontalSpan <= gridWidthInSquares
                ) {
                    const dominoOrientationDirections = board.Dominoes.map(
                        (domino) => domino.Direction
                    );
                    return {
                        gridWidthInSquares,
                        gridHeightInSquares,
                        gridSquarePixelSize,
                        boundingBoxes: translatedBoundingBoxes,
                        dominoOrientationDirections
                    };
                }
            }

            // Board does not fit at original size, need to bend and/or shrink
            // First, to set up the grid, center the domino layout on the grid (will overflow,
            // but center of grid should match center of the current domino layout boundaries
            // Therefore our vertical and horizontal shifting occurs here
            // Make sure to round appropriately (if bigger dimension has odd # of squares)

            const fitsWithoutBending = translatedBoundingBoxes.map((box) =>
                boundingBoxFitsInGrid(
                    box,
                    gridWidthInSquares,
                    gridHeightInSquares
                )
            );

            const boxesThatFitWithoutBending = translatedBoundingBoxes.filter(
                (box, i) => fitsWithoutBending[i]
            );
            const northLimitWithoutBending = Math.min(
                ...boxesThatFitWithoutBending.map((box) => box.North)
            );
            const northLimitBoundingBoxIndex =
                translatedBoundingBoxes.findIndex(
                    (box, i) =>
                        box.North === northLimitWithoutBending &&
                        fitsWithoutBending[i]
                );
            const northLimitBoundingBox =
                translatedBoundingBoxes[northLimitBoundingBoxIndex];

            const eastLimitWithoutBending = Math.max(
                ...boxesThatFitWithoutBending.map((box) => box.East)
            );
            const eastLimitBoundingBoxIndex = translatedBoundingBoxes.findIndex(
                (box, i) =>
                    box.East === eastLimitWithoutBending &&
                    fitsWithoutBending[i]
            );
            const eastLimitBoundingBox =
                translatedBoundingBoxes[eastLimitBoundingBoxIndex];

            const southLimitWithoutBending = Math.max(
                ...boxesThatFitWithoutBending.map((box) => box.South)
            );
            const southLimitBoundingBoxIndex =
                translatedBoundingBoxes.findIndex(
                    (box, i) =>
                        box.South === southLimitWithoutBending &&
                        fitsWithoutBending[i]
                );
            const southLimitBoundingBox =
                translatedBoundingBoxes[southLimitBoundingBoxIndex];

            const westLimitWithoutBending = Math.min(
                ...boxesThatFitWithoutBending.map((box) => box.West)
            );
            const westLimitBoundingBoxIndex = translatedBoundingBoxes.findIndex(
                (box, i) =>
                    box.West === westLimitWithoutBending &&
                    fitsWithoutBending[i]
            );
            const westLimitBoundingBox =
                translatedBoundingBoxes[westLimitBoundingBoxIndex];

            // Now see if we need to translate the bounding boxes for the spinner
            if (board.Spinner) {
                // Check if the spinner and adjacent (within 6 square distance) dominoes are within
                // the non-bending area

                const translatedSpinnerBoundingBox =
                    translatedBoundingBoxes[board.SpinnerIndex];

                const hasMargin = true; // write a function later
                if (!hasMargin) {
                    // translate bounding boxes the minimum necessary to give the spinner its margin
                }
            }

            // Now the bounding boxes are set for bending

            const newBoundingBoxes = translatedBoundingBoxes.map((box, i) => {
                // Keep all translated bounding boxes where they are if they fit inside the grid without bending
                if (fitsWithoutBending[i]) {
                    return box;
                } else {
                    if (box.North < 0) {
                        return bendBoundingBoxAroundPoint(
                            box,
                            northLimitBoundingBox.West,
                            northLimitBoundingBox.North + 2,
                            Direction.NORTH,
                            board.Dominoes[northLimitBoundingBoxIndex].IsDouble
                        );
                    } else if (box.East > gridWidthInSquares) {
                        return bendBoundingBoxAroundPoint(
                            box,
                            eastLimitBoundingBox.East - 2,
                            eastLimitBoundingBox.North,
                            Direction.EAST,
                            board.Dominoes[eastLimitBoundingBoxIndex].IsDouble
                        );
                    } else if (box.South > gridHeightInSquares) {
                        return bendBoundingBoxAroundPoint(
                            box,
                            southLimitBoundingBox.East,
                            southLimitBoundingBox.South - 2,
                            Direction.SOUTH,
                            board.Dominoes[southLimitBoundingBoxIndex].IsDouble
                        );
                    } else if (box.West < 0) {
                        return bendBoundingBoxAroundPoint(
                            box,
                            westLimitBoundingBox.West + 2,
                            westLimitBoundingBox.South,
                            Direction.WEST,
                            board.Dominoes[westLimitBoundingBoxIndex].IsDouble
                        );
                    } else {
                        throw new Error(
                            "Invalid bend attempted. Bounding box coordinates: " +
                                JSON.stringify(box)
                        );
                    }
                }
            });

            const newDominoOrientationDirections = board.Dominoes.map(
                (domino, i) => {
                    if (fitsWithoutBending[i]) {
                        return domino.Direction;
                    } else {
                        return rotateDirectionClockwise(domino.Direction);
                    }
                }
            );

            // Now see if the bent dominoes actually fit
            const bentLayoutVerticalSpan =
                Math.max(...newBoundingBoxes.map((box) => box.South)) -
                Math.min(...newBoundingBoxes.map((box) => box.North));
            const bentLayoutHorizontalSpan =
                Math.max(...newBoundingBoxes.map((box) => box.East)) -
                Math.min(...newBoundingBoxes.map((box) => box.West));

            if (
                bentLayoutVerticalSpan <= gridHeightInSquares &&
                bentLayoutHorizontalSpan <= gridWidthInSquares
            ) {
                return {
                    gridWidthInSquares,
                    gridHeightInSquares,
                    gridSquarePixelSize,
                    boundingBoxes: newBoundingBoxes,
                    dominoOrientationDirections: newDominoOrientationDirections
                };
            } else {
                i++;
            }
        }
    };

    const gridDescription = layoutDominoes(
        props.width,
        props.height,
        props.board
    );
    const gridHeightInSquares = gridDescription.gridHeightInSquares;
    const gridWidthInSquares = gridDescription.gridWidthInSquares;
    const gridSquarePixelSize = gridDescription.gridSquarePixelSize;
    const boundingBoxes = gridDescription.boundingBoxes;
    const dominoOrientationDirections =
        gridDescription.dominoOrientationDirections;

    console.log(gridDescription);

    return (
        <div
            className="board"
            style={{
                gridTemplateRows: `repeat(${gridHeightInSquares}, ${gridSquarePixelSize}px)`,
                gridTemplateColumns: `repeat(${gridWidthInSquares}, ${gridSquarePixelSize}px)`
            }}
        >
            {props.board.Dominoes.map((domino, i) => {
                const box = boundingBoxes[i];
                return (
                    <BoardDominoView
                        key={i}
                        north={box.North + 1}
                        east={box.East + 1}
                        south={box.South + 1}
                        west={box.West + 1}
                    >
                        <DominoView
                            face1={domino.Face1}
                            face2={domino.Face2}
                            direction={dominoOrientationDirections[i]}
                            size={(gridSquarePixelSize - 1) * 2}
                        />
                    </BoardDominoView>
                );
            })}
        </div>
    );
});
