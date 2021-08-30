import { IBoardDomino } from "@root/model/BoardDominoModel";
import { IBoard, IBoardModel } from "@root/model/BoardModel";

export const BoardViewModel = (model: IBoardModel) => {
    const board = model as IBoard;

    return {
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
                if (minY > 0) {
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
        }
    };
};
