import React, { Component } from "react";
import ReactDOM from "react-dom";

export default class NumberShapesCrush extends React.Component {
  componentDidMount() {
    window.location.replace(
      "https://apps.apple.com/us/app/numbershapes/id1444912086#?platform=ipad"
    );
  }

  render() {
    return (
      <div>
        <iframe
          src="https://apps.apple.com/us/app/numbershapes/id1444912086#?platform=ipad"
          height={window.innerHeight}
          width={window.innerWidth}
        />
      </div>
    );
  }
}
