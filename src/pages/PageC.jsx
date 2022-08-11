import React, { Component } from "react";

export default class PageC extends Component {
  render() {
    const { history } = this.props;
    return (
      <div>
        <button
          onClick={() => {
            history.push("/a");
          }}
        >to A</button>
        <button
          onClick={() => {
            history.push("/b");
          }}
        >to B</button>
      </div>
    );
  }
}
