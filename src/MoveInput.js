import React from 'react';
import './App.css';

class MoveInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);}

  handleChange(event) {
    this.setState({value: event.target.value});
  }
  handleSubmit(event) {
    this.props.socket.emit("response", this.state.value);
    this.setState({value: ""});
    event.preventDefault();
  }

  render() {
    return (
      <div style={this.props.style}>
        <form onSubmit={this.handleSubmit}>
          <label>
            Move:
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  } 
}

export default MoveInput;
