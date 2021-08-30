import { IBoardDomino, IBoardDominoModel } from "@root/model/BoardDominoModel";

export const BoardDominoViewModel = (model: IBoardDominoModel) => {
    const domino = model as IBoardDomino;

    return {
        get IsDouble(): boolean {
            return domino.Domino.Face1 === domino.Domino.Face2;
        }
    };
};
