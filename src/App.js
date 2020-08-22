import React from 'react';
import Face from './Face.js'
import './App.css';

function App() {
  var faces = [];
  var i;
  for (i = 0; i <= 6; i++){
    faces.push(<Face num={i} />)
  }
  return (
    <div className="App">
      <p>Dominos!</p>
      {faces}
    </div>
  );
}

export default App;
