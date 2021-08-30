import { IBoardDomino, IBoardDominoModel } from "@root/model/BoardDominoModel";

export const BoardDominoViewModel = (model: IBoardDominoModel) => {
    const domino = model as IBoardDomino;

    return {
        get IsDouble(): boolean {
            return domino.Domino.Face1 === domino.Domino.Face2;
        },

        get X(): number {
            return domino.Location.X;
        },

        get Y(): number {
            return domino.Location.Y;
        }
    };
};
