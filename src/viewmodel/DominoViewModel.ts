import { IDomino, IDominoModel } from "@root/model/DominoModel";

export const DominoViewModel = (model: IDominoModel) => {
    const domino = model as IDomino;

    return {
        get IsDouble(): boolean {
            return domino.Face1 === domino.Face2;
        }
    };
};
