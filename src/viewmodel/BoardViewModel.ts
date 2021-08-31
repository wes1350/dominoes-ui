import { Direction } from "enums/Direction";
import { BoundingBox } from "interfaces/BoundingBox";
import { Coordinate } from "interfaces/Coordinate";
import { IBoardDomino } from "model/BoardDominoModel";
import { IBoard, IBoardModel } from "model/BoardModel";
import { Domino, IDomino } from "model/DominoModel";

export const BoardViewModel = (model: IBoardModel) => {
    const board = model as IBoard;

    return {
        get Spinner(): IBoardDomino {
            if (board.SpinnerIndex !== null) {
                return board.Dominoes[board.SpinnerIndex];
            } else {
                return null;
            }
        },

        get IsEmpty(): boolean {
            return board.Dominoes.length === 0;
        },

        get NorthEdge(): IBoardDomino {
            if (!board.Spinner) {
                return null;
            } else {
                const maxY = Math.max(
                    ...board.Dominoes.map((domino) => domino.Y)
                );
                if (maxY > 0) {
                    return board.Dominoes.find((domino) => domino.Y === maxY);
                } else {
                    return board.Spinner;
                }
            }
        },

        get SouthEdge(): IBoardDomino {
            if (!board.Spinner) {
                return null;
            } else {
                const minY = Math.min(
                    ...board.Dominoes.map((domino) => domino.Y)
                );
                if (minY < 0) {
                    return board.Dominoes.find((domino) => domino.Y === minY);
                } else {
                    return board.Spinner;
                }
            }
        },

        get EastEdge(): IBoardDomino {
            return board.Dominoes.find(
                (domino) =>
                    domino.X ===
                    Math.max(...board.Dominoes.map((domino) => domino.X))
            );
        },

        get WestEdge(): IBoardDomino {
            return board.Dominoes.find(
                (domino) =>
                    domino.X ===
                    Math.min(...board.Dominoes.map((domino) => domino.X))
            );
        },

        get RenderedNorthBoundary(): number {
            if (board.IsEmpty) {
                return null;
            }
            return Math.min(
                ...board.Dominoes.map((domino) => domino.BoundingBox.North)
            );
        },

        get RenderedSouthBoundary(): number {
            if (board.IsEmpty) {
                return null;
            }
            return Math.max(
                ...board.Dominoes.map((domino) => domino.BoundingBox.South)
            );
        },

        get RenderedEastBoundary(): number {
            if (board.IsEmpty) {
                return null;
            }
            return Math.max(
                ...board.Dominoes.map((domino) => domino.BoundingBox.East)
            );
        },

        get RenderedWestBoundary(): number {
            if (board.IsEmpty) {
                return null;
            }
            return Math.min(
                ...board.Dominoes.map((domino) => domino.BoundingBox.West)
            );
        },

        DominoAt(location: Coordinate) {
            return board.Dominoes.find(
                (domino) => domino.X === location.X && domino.Y === location.Y
            );
        },

        CalculateBoundingBox(
            domino: IDomino,
            location: Coordinate
        ): BoundingBox {
            if (location.Y > 0) {
                // adding on north side
                const boxAtEdge = board.NorthEdge.BoundingBox;

                return {
                    North: domino.IsDouble
                        ? boxAtEdge.North - 2
                        : boxAtEdge.North - 4,
                    East: domino.IsDouble
                        ? boxAtEdge.East + 1
                        : boxAtEdge.East -
                          (board.NorthEdge.IsDouble && board.NorthEdge.Y !== 0
                              ? 1
                              : 0),
                    South: boxAtEdge.North,
                    West: domino.IsDouble
                        ? boxAtEdge.West - 1
                        : boxAtEdge.West +
                          (board.NorthEdge.IsDouble && board.NorthEdge.Y !== 0
                              ? 1
                              : 0)
                };
            } else if (location.Y < 0) {
                // adding on south side
                const boxAtEdge = board.SouthEdge.BoundingBox;

                return {
                    North: boxAtEdge.South,
                    East: domino.IsDouble
                        ? boxAtEdge.East + 1
                        : boxAtEdge.East -
                          (board.SouthEdge.IsDouble && board.SouthEdge.Y !== 0
                              ? 1
                              : 0),
                    South: domino.IsDouble
                        ? boxAtEdge.South + 2
                        : boxAtEdge.South + 4,
                    West: domino.IsDouble
                        ? boxAtEdge.West - 1
                        : boxAtEdge.West +
                          (board.SouthEdge.IsDouble && board.SouthEdge.Y !== 0
                              ? 1
                              : 0)
                };
            } else if (location.X > 0) {
                // adding on east side
                const boxAtEdge = board.EastEdge.BoundingBox;

                return {
                    North: domino.IsDouble
                        ? boxAtEdge.North - 1
                        : boxAtEdge.North + (board.EastEdge.IsDouble ? 1 : 0),
                    East: domino.IsDouble
                        ? boxAtEdge.East + 2
                        : boxAtEdge.East + 4,
                    South: domino.IsDouble
                        ? boxAtEdge.South + 1
                        : boxAtEdge.South - (board.EastEdge.IsDouble ? 1 : 0),
                    West: boxAtEdge.East
                };
            } else if (location.X < 0) {
                // adding on west side
                const boxAtEdge = board.WestEdge.BoundingBox;

                return {
                    North: domino.IsDouble
                        ? boxAtEdge.North - 1
                        : boxAtEdge.North + (board.WestEdge.IsDouble ? 1 : 0),
                    East: boxAtEdge.West,
                    South: domino.IsDouble
                        ? boxAtEdge.South + 1
                        : boxAtEdge.South - (board.WestEdge.IsDouble ? 1 : 0),
                    West: domino.IsDouble
                        ? boxAtEdge.West - 2
                        : boxAtEdge.West - 4
                };
            } else {
                // first domino is always at 0, 0
                if (domino.IsDouble) {
                    return {
                        North: -2,
                        East: 1,
                        South: 2,
                        West: -1
                    };
                } else {
                    return {
                        North: -1,
                        East: 2,
                        South: 1,
                        West: -2
                    };
                }
            }
        },

        DropAreaBoundingBoxes(): Map<boolean, Map<Direction, BoundingBox>> {
            // Mimic dominoes for determining drop area bounding boxes
            const dropAreaBoundingBoxes = new Map<
                boolean,
                Map<Direction, BoundingBox>
            >();

            dropAreaBoundingBoxes.set(false, new Map());
            dropAreaBoundingBoxes.set(true, new Map());

            if (board.Dominoes.length === 0) {
                [true, false].forEach((isDouble) => {
                    const mockDomino = Domino.create({
                        Face1: 0,
                        Face2: isDouble ? 0 : 1
                    });
                    dropAreaBoundingBoxes.get(isDouble).set(
                        Direction.NONE,
                        board.CalculateBoundingBox(mockDomino, {
                            X: 0,
                            Y: 0
                        })
                    );
                });
            } else {
                [true, false].forEach((isDouble) => {
                    const mockDomino = Domino.create({
                        Face1: 0,
                        Face2: isDouble ? 0 : 1
                    });
                    if (board.EastEdge) {
                        dropAreaBoundingBoxes.get(isDouble).set(
                            Direction.EAST,
                            board.CalculateBoundingBox(mockDomino, {
                                X: board.EastEdge.X + 1,
                                Y: 0
                            })
                        );
                    }
                    if (board.WestEdge) {
                        const mockDomino = Domino.create({
                            Face1: 0,
                            Face2: isDouble ? 0 : 1
                        });
                        dropAreaBoundingBoxes.get(isDouble).set(
                            Direction.WEST,
                            board.CalculateBoundingBox(mockDomino, {
                                X: board.WestEdge.X - 1,
                                Y: 0
                            })
                        );
                    }
                    if (board.NorthEdge) {
                        const mockDomino = Domino.create({
                            Face1: 0,
                            Face2: isDouble ? 0 : 1
                        });

                        dropAreaBoundingBoxes.get(isDouble).set(
                            Direction.NORTH,
                            board.CalculateBoundingBox(mockDomino, {
                                X: board.Spinner.X,
                                Y: board.NorthEdge.Y + 1
                            })
                        );
                    }
                    if (board.SouthEdge) {
                        const mockDomino = Domino.create({
                            Face1: 0,
                            Face2: isDouble ? 0 : 1
                        });
                        dropAreaBoundingBoxes.get(isDouble).set(
                            Direction.SOUTH,
                            board.CalculateBoundingBox(mockDomino, {
                                X: board.Spinner.X,
                                Y: board.SouthEdge.Y + 1
                            })
                        );
                    }
                });
            }

            return dropAreaBoundingBoxes;
        }
    };
};
