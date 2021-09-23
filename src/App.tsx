import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { AboutPage } from "view/AboutPage";
import { RoomView } from "view/RoomView";
import { HomePage } from "view/HomePage";
import { BoardViewTest } from "test/BoardViewTest";
import { observer, useLocalObservable } from "mobx-react-lite";
import { BackendGateway } from "io/BackendGateway";
import { action, runInAction } from "mobx";
import { PlayerNameContext } from "context/PlayerNameContext";
const io = require("socket.io-client");

export const App = observer(() => {
    const localStore = useLocalObservable(() => ({
        socket: null,
        playerName: null
    }));

    React.useEffect(() => {
        localStore.socket = io("http://localhost:3001");
        return () => localStore.socket.close();
    }, []);

    React.useEffect(() => {
        if (!localStore.playerName) {
            BackendGateway.GetName().then((name) => {
                if (name) {
                    runInAction(() => {
                        localStore.playerName = name;
                    });
                }
            });
        }
    }, []);

    return (
        <div className="App">
            <PlayerNameContext.Provider
                value={{
                    name: localStore.playerName,
                    setName: (name: string) => {
                        if (name) {
                            BackendGateway.SetName(name).then(
                                action(() => {
                                    localStore.playerName = name;
                                })
                            );
                        }
                    }
                }}
            >
                <Router>
                    <Switch>
                        <Route path="/room/:roomId">
                            <RoomView socket={localStore.socket} />
                        </Route>
                        <Route path="/about">
                            <AboutPage />
                        </Route>
                        <Route path="/test">
                            <BoardViewTest />
                        </Route>
                        <Route path="/">
                            <HomePage socket={localStore.socket} />
                        </Route>
                    </Switch>
                </Router>
            </PlayerNameContext.Provider>
        </div>
    );
});
