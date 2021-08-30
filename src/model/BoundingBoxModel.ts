import { Instance, types } from "mobx-state-tree";

export const BoundingBoxModel = types.model({
    north: types.number,
    east: types.number,
    south: types.number,
    west: types.number
});

export type IBoundingBoxModel = Instance<typeof BoundingBoxModel>;

export const BoundingBox = BoundingBoxModel;
export type IBoundingBox = Instance<typeof BoundingBox>;
