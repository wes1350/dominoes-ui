import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AboutPage } from "view/AboutPage";
import { RoomView } from "view/RoomView";
import { HomePage } from "view/HomePage";
import { BoardViewTest } from "test/BoardViewTest";
import { observer } from "mobx-react-lite";
import { PlayerNameView } from "view/PlayerNameView";
import { PlayerDataContextProvider } from "context/PlayerDataContext";
import { SocketContextProvider } from "context/SocketContext";

export const App = observer(() => {
    return (
        <div className="App">
            <PlayerDataContextProvider>
                <SocketContextProvider>
                    <PlayerNameView />
                    <Router>
                        <Switch>
                            <Route path="/room/:roomId">
                                <RoomView />
                            </Route>
                            <Route path="/about">
                                <AboutPage />
                            </Route>
                            <Route path="/test">
                                <BoardViewTest />
                            </Route>
                            <Route path="/">
                                <HomePage />
                            </Route>
                        </Switch>
                    </Router>
                </SocketContextProvider>
            </PlayerDataContextProvider>
        </div>
    );
});
