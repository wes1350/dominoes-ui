import { IDominoModel } from "@root/model/DominoModel";
import { IPlayer, IPlayerModel } from "@root/model/PlayerModel";
import { cast } from "mobx-state-tree";

export const PlayerController = (model: IPlayerModel) => {
    const player = model as IPlayer;
    return {
        SetHand(hand: IDominoModel[]) {
            player.Hand = cast(hand);
        },

        SetPlayableDominoes(playable: number[]) {
            player.PlayableDominoes = cast(playable);
        },

        AddDomino(desc: IDominoModel) {
            model.Hand.push(desc);
        },

        RemoveDomino(desc?: IDominoModel) {
            if (!desc) {
                model.Hand = cast(model.Hand.slice(1));
            } else {
                model.Hand = cast(
                    model.Hand.filter(
                        (d) =>
                            !(d.Face1 === desc.Face1 && d.Face2 === desc.Face2)
                    )
                );
            }
        },

        SetScore(score: number): void {
            model.Score = score;
        }
    };
};
