import React, { Component } from "react";
import ReactDOM from "react-dom";

const links = {
  crush: "https://apps.apple.com/us/app/numbershapes/id1444912086#?platform=ipad",
  whiteboard: "https://apps.apple.com/us/app/numbershapes-whiteboard/id1052209727",
  multiplication: "https://apps.apple.com/us/app/multiplication-fact-workout/id1085400375"
}

export default class WebLink extends React.Component {


  componentDidMount() {
    const {app} =  this.props.match.params
    this.link = links[app]
    window.location.replace(this.link);
  }

  render() {
    return (
      <div>
        <iframe
          src={this.link}
          height={window.innerHeight}
          width={window.innerWidth}
        />
      </div>
    );
  }
}
