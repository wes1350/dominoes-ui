import React from 'react';

function Face(props) {
  return <img src={require("./faces/face" + props.num + ".png")} alt="domino face" 
          height="25" width="25" style={props.style} />;
}

export default Face;
