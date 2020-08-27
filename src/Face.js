import React from 'react';

function Face(props) {
  return <img src={require("./faces/face" + props.num + ".png")} alt="domino face" 
          height="50" width="50" style={props.style} />;
}

export default Face;
