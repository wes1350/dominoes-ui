import { PlayerDataContext } from "context/PlayerDataContext";
import { SocketContext } from "context/SocketContext";
import { Direction } from "enums/Direction";
import { GameEventType } from "enums/GameEventType";
import { MessageType } from "enums/MessageType";
import { QueryType } from "enums/QueryType";
import { Coordinate } from "interfaces/Coordinate";
import {
    GameLogMessage,
    GameStartMessage,
    NewRoundMessage
} from "interfaces/Messages";
import { runInAction, when } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { SnapshotIn } from "mobx-state-tree";
import { Board } from "model/BoardModel";
import { Domino, IDomino } from "model/DominoModel";
import { GameConfig } from "model/GameConfigModel";
import { GameState, IGameState } from "model/GameStateModel";
import { Player } from "model/PlayerModel";
import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { generateId } from "utils/utils";
import { RoomLobbyView } from "./RoomLobbyView";
import { GameView } from "./GameView";

interface IProps {}

type RoomParams = {
    roomId: string;
};

export const RoomView = observer((props: IProps) => {
    const playerDataContext = useContext(PlayerDataContext);
    const playerName = playerDataContext.name;

    const socketContext = useContext(SocketContext);
    const socket = socketContext?.socket;

    const { roomId } = useParams<RoomParams>();

    const localStore = useLocalObservable(() => ({
        gameState: null,
        roomDetails: []
    }));

    React.useEffect(() => {
        if (socket && playerName) {
            setUpSocketForRoomLobby();
            socket.emit(MessageType.JOIN_ROOM, roomId);
            setUpSocketForGameStart();
        }
    }, [socketContext, playerDataContext]);

    const setUpSocketForRoomLobby = () => {
        socket.on(
            MessageType.ROOM_DETAILS,
            (roomDetails: { name: string }[]) => {
                runInAction(() => {
                    localStore.roomDetails = roomDetails;
                });
            }
        );
    };

    const setUpSocketForGameStart = () => {
        // Might need to add some sort of socket.offAll() in case of reconnects
        socket.on(MessageType.GAME_START, (gameDetails: GameStartMessage) => {
            console.log("starting game");
            runInAction(() => {
                localStore.gameState = initializeGameState(gameDetails);
            });
            setUpSocketForGameplay(socket, localStore.gameState);

            socket.off(MessageType.GAME_START);
        });
    };

    const initializeGameState = (gameDetails: GameStartMessage) => {
        const gameConfig = GameConfig.create({
            HAND_SIZE: gameDetails.config.n_dominoes,
            N_PLAYERS: gameDetails.players.length
        });
        const newGameState = GameState.create({
            Config: gameConfig,
            Board: Board.create({})
        });

        gameDetails.players.forEach((player) => {
            newGameState.AddPlayer(
                Player.create({
                    Name: player.name,
                    SeatNumber: player.seatNumber,
                    IsMe: player.isMe
                })
            );
        });

        newGameState.Start();
        return newGameState;
    };

    const setUpSocketForGameplay = (socket: any, gameState: IGameState) => {
        socket.on(MessageType.GAME_LOG, (logDetails: GameLogMessage) => {
            console.log(logDetails);
            gameState.AddLog(logDetails.message);
        });
        socket.on(
            MessageType.TURN,
            (turnDescription: {
                seat: number;
                domino: SnapshotIn<IDomino>;
                direction: Direction;
                coordinate: Coordinate;
            }) => {
                const domino = turnDescription.domino
                    ? Domino.create(turnDescription.domino)
                    : null;

                gameState.ProcessTurn(
                    domino,
                    turnDescription.direction,
                    turnDescription.coordinate
                );
                gameState.Me.SetPlayableDominoes(null);

                if (!domino) {
                    gameState.AddEvent({
                        Id: Math.floor(Math.random() * 10000000),
                        Type: GameEventType.PASS,
                        Duration: 1000,
                        Seat: turnDescription.seat
                    });
                }
            }
        );
        socket.on(
            MessageType.SCORE,
            (payload: { seat: number; score: number }) => {
                gameState.AddEvent({
                    Id: Math.floor(Math.random() * 10000000),
                    Type: GameEventType.SCORE,
                    Duration: 1000,
                    Seat: payload.seat,
                    Score: payload.score
                });

                gameState.ProcessScore(payload.seat, payload.score);
            }
        );
        socket.on(
            MessageType.HAND,
            (payload: { Face1: number; Face2: number }[]) => {
                when(
                    () => gameState.Events.length === 0,
                    () => {
                        gameState.Me.SetHand(payload as IDomino[]);
                    }
                );
            }
        );
        socket.on(MessageType.PLAYABLE_DOMINOES, (payload: string) => {
            gameState.Me.SetPlayableDominoes(JSON.parse("[" + payload + "]"));
        });
        socket.on(MessageType.DOMINO_PLAYED, (payload: { seat: number }) => {
            const player = gameState.PlayerAtSeat(payload.seat);
            if (!player.IsMe) {
                player.RemoveDomino();
            }
        });
        socket.on(MessageType.CLEAR_BOARD, () => {
            when(
                () => gameState.Events.length === 0,
                () => {
                    gameState.ClearBoard();
                }
            );
        });
        socket.on(MessageType.PULL, (payload: { seat: number }) => {
            const player = gameState.PlayerAtSeat(payload.seat);
            if (!player.IsMe) {
                player.AddDomino(Domino.create({ Face1: -1, Face2: -1 }));
            }
        });
        socket.on(MessageType.NEW_ROUND, (payload: NewRoundMessage) => {
            when(
                () => gameState.Events.length === 0,
                () => {
                    gameState.SetCurrentPlayerIndex(payload.currentPlayer);
                    gameState.InitializeOpponentHands();
                }
            );
        });

        socket.on(QueryType.MOVE, (message: string) => {
            gameState.SetQueryType(QueryType.MOVE);
        });

        socket.on(MessageType.GAME_OVER, (winner: number) => {
            gameState.Finish();
        });

        socket.on(MessageType.GAME_BLOCKED, () => {
            gameState.AddEvent({
                Id: generateId(),
                Type: GameEventType.BLOCKED,
                Duration: 2000
            });
        });
    };

    const respondToQuery = (type: QueryType, value: any) => {
        socket.emit(type, value);
    };

    if (!socket) {
        return null;
    }

    return (
        <div className="room-view">
            {playerName ? (
                localStore.gameState ? (
                    <GameView
                        gameState={localStore.gameState}
                        respond={respondToQuery}
                    ></GameView>
                ) : (
                    <RoomLobbyView
                        roomId={roomId}
                        roomDetails={localStore.roomDetails}
                    />
                )
            ) : (
                <div>This should never be seen</div>
                // <NameDialog onSubmitName={onSubmitName} />
            )}
        </div>
    );
});
