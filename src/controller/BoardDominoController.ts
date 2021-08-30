import { IBoardDomino, IBoardDominoModel } from "@root/model/BoardDominoModel";

export const BoardDominoController = (model: IBoardDominoModel) => {
    const boardDomino = model as IBoardDomino;
    return {
        // SetCoordinates(x: number, y: number) {
        //     boardDomino.Location.X = x;
        //     boardDomino.Location.Y = y;
        // }
    };
};
