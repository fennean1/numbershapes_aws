import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import * as ACTIVITIES from "./Activities"

export default class ActivityPage extends Component {
  constructor(props) {
    super(props);    
  }


  render() {
    const {activity} =  this.props.match.params
    const myActivity = ACTIVITIES[activity]

    const keys = Object.keys(myActivity.links)

    const links = keys.map((e) => {
      switch (e) {
        case "youtube":
          return (
            <div style={{ padding: 10 }}>
              <a href = {myActivity.links[e]}>
                <Button variant = "outlined" >YouTube</Button>
              </a>
            </div>
          );
          break;
        case "medium":
          return (
            <div style={{ padding: 10 }}>
              <a href = {myActivity.links[e]}>
                <Button variant = "outlined" >Medium Article</Button>
              </a>
            </div>
          );
          break;
        case "interactive":
          return (
            <div style={{ padding: 10 }}>
              <Link to={"/"+myActivity.links[e]}>
                <Button variant = 'outlined'>Interactive</Button>
              </Link>
            </div>
          );
          break;
        case "slides":
          return (
            <div style={{ padding: 10 }}>
              <a href = {myActivity.links[e]}>
                <Button variant = "outlined" >Google Slides</Button>
              </a>
            </div>
          );
          break;
        default:
          return;
          break;
      }
    });

    const steps = myActivity.quickStart.map((e) => {
      return (
        <blockquote style={{ marginLeft: 10 }}>
          <p class="flow-text">{e}</p>
        </blockquote>
      );
    });

    return (
      <div
        style={{
          padding: "2%",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
        className="container"
      >
        <h3 style={{ padding: 5, display: "block", margin: "auto" }}>
          {myActivity.title}
        </h3>
        <div style={{ padding: 5, display: "block", margin: "auto" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>{links}</div>
        </div>
        <img style = {{width: "50vw",margin: 'auto'}} src = {require('./assets/'+myActivity.previewImg)}/>
        <div style={{ flexGrow: 1 }}>
          {" "}
          <h4>Introduction</h4>
          <div style={{ borderRadius: 10, padding: 5 }}>
            <p className="flow-text">
              {myActivity.introduction}
            </p>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          {" "}
          <h4> Quick Start</h4>
          <div style={{ borderRadius: 10, padding: 5 }}>{steps}</div>
        </div>
        <div style={{ flex: 1 }}>
          {" "}
          <h4> Synthesis</h4>
          <div style={{ borderRadius: 10, padding: 5 }}>
            <p className="flow-text">
              {" "}
             {myActivity.synthesis}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
