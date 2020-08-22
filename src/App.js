import React from 'react';
import Domino from './Domino.js'
import './App.css';

function App() {
  return (
    <div className="App">
      <p>Dominos!</p>
      <div class="domino-board">
        <Domino face1={3} face2={0} reversed={false} loc1={{gridRow:"1", gridColumn:"1"}} loc2={{gridRow:"1", gridColumn:"2"}} />
        <Domino face1={4} face2={1} reversed={true} loc1={{gridRow:"2", gridColumn:"2"}} loc2={{gridRow:"2", gridColumn:"3"}} />
        <Domino face1={5} face2={2} reversed={false} loc1={{gridRow:"3", gridColumn:"3"}} loc2={{gridRow:"3", gridColumn:"4"}} />
        <Domino face1={6} face2={3} reversed={false} loc1={{gridRow:"4", gridColumn:"4"}} loc2={{gridRow:"5", gridColumn:"4"}} />
        <Domino face1={0} face2={4} reversed={false} loc1={{gridRow:"5", gridColumn:"3"}} loc2={{gridRow:"6", gridColumn:"3"}} />
        <Domino face1={1} face2={5} reversed={false} loc1={{gridRow:"7", gridColumn:"3"}} loc2={{gridRow:"8", gridColumn:"3"}} />
        <Domino face1={2} face2={6} reversed={false} loc1={{gridRow:"8", gridColumn:"2"}} loc2={{gridRow:"8", gridColumn:"1"}} />
      </div>
    </div>
  );
}

export default App;
