import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { AboutPage } from "view/AboutPage";
import { RoomView } from "view/RoomView";
import { HomePage } from "view/HomePage";
import { BoardViewTest } from "test/BoardViewTest";
import { observer, useLocalObservable } from "mobx-react-lite";
const io = require("socket.io-client");

export const App = observer(() => {
    const localStore = useLocalObservable(() => ({
        socket: null
    }));

    React.useEffect(() => {
        localStore.socket = io("http://localhost:3001");
        console.log(localStore.socket);
        return () => localStore.socket.close();
    }, []);

    return (
        <Router>
            <div className="App">
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
                        <HomePage />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
});
