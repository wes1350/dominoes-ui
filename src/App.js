import React from 'react';
import Domino from './Domino.js'
import './App.css';

function App() {
  return (
    <div className="App">
      <p>Dominos!</p>
      <Domino face1={3} face2={2} reversed={true} />
      <Domino face1={3} face2={2} reversed={false} />
    </div>
  );
}

export default App;
