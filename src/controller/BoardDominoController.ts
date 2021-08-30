import { IBoardDomino, IBoardDominoModel } from "@root/model/BoardDominoModel";

export const BoardDominoController = (model: IBoardDominoModel) => {
    const boardDomino = model as IBoardDomino;
    return {
        SetCoordinates(x: number, y: number) {
            boardDomino.X = x;
            boardDomino.Y = y;
        },

        SetIsSpinner() {
            boardDomino.IsSpinner = true;
        }
    };
};
