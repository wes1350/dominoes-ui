import React from 'react';
import face0 from './face0.png';
import face1 from './face1.png';
import face2 from './face2.png';
import face3 from './face3.png';
import face4 from './face4.png';
import face5 from './face5.png';
import face6 from './face6.png';
import './App.css';

function App() {
  return (
    <div className="App">
      <p>Dominos!</p>
      <img src={face0} className="domino-face" alt="0" />
      <img src={face1} className="domino-face" alt="1" />
      <img src={face2} className="domino-face" alt="2" />
      <img src={face3} className="domino-face" alt="3" />
      <img src={face4} className="domino-face" alt="4" />
      <img src={face5} className="domino-face" alt="5" />
      <img src={face6} className="domino-face" alt="6" />
    </div>
  );
}

export default App;
