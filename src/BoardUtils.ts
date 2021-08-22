import { Direction } from "./Enums";

export interface CoordinateDescription {
    x: number;
    y: number;
    double: boolean;
}

export interface BoundingBoxDescription {
    north: number;
    east: number;
    south: number;
    west: number;
}

export interface TranslatedDominoDescription {
    face1?: number;
    face2?: number;
    direction: Direction;
    north: number;
    east: number;
    south: number;
    west: number;
}

export const addValueToNestedMap = (
    map: Map<any, Map<any, any>>,
    value1: any,
    value2: any,
    value3: any
) => {
    if (!map.has(value1)) {
        map.set(value1, new Map());
    }
    map.get(value1).set(value2, value3);
};
