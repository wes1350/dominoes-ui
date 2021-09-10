import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { AboutPage } from "view/AboutPage";
import { RoomView } from "view/RoomView";
import { HomePage } from "view/HomePage";
import { BoardViewTest } from "test/BoardViewTest";

export const App = () => {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/room/:id">
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
            </div>
        </Router>
    );
};
