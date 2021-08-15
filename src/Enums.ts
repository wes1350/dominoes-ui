export enum QueryType {
    DOMINO = "QUERY_DOMINO",
    DIRECTION = "QUERY_DIRECTION",
    PULL = "QUERY_PULL"
}

export enum MessageType {
    GAME_START = "GAME_START",
    ADD_DOMINO = "ADD_DOMINO",
    PLAYABLE_DOMINOS = "PLAYABLE_DOMINOS",
    HAND = "HAND",
    GAME_OVER = "GAME_OVER",
    PACK_EMPTY = "PACK_EMPTY",
    SCORES = "SCORES",
    ERROR = "ERROR",
    TURN = "TURN"
}

export enum Direction {
    NORTH = "N",
    EAST = "E",
    SOUTH = "S",
    WEST = "W",
    NONE = ""
}
