import React from 'react';

function Face(props) {
  return <img src={require("./faces/face" + props.num + ".png")} alt="domino face" />;
}

export default Face;
