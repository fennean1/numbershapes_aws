import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import LessonCard from "./LessonCard";
import { Switch, Route, Link } from "react-router-dom";
import * as ASSETS from "./AssetManager.js";
import * as ACTIVITIES from "./Activities.js";

class ChoiceGrid extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return (
      <div className="clouds">
        <div className="container">
          <div className="section no-pad-bot" id="index-banner">
            <h1 className="header center">Activities</h1>
          </div>
          <div style={{ flexDirection: "row", display: "flex" }}>
            <div style={{ flexDirection: "column", display: "flex", flex: 1 }}>
              <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <LessonCard data={ACTIVITIES.ACTIVITY_ONE} />
              </div>
              <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <LessonCard data={ACTIVITIES.ACTIVITY_EIGHT} />
              </div>
              <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <LessonCard data={ACTIVITIES.ACTIVITY_TWO} />
              </div>
            </div>
            <div style={{ flexDirection: "column", display: "flex", flex: 1 }}>
            <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <LessonCard data={ACTIVITIES.ACTIVITY_SEVEN} />
              </div>
              <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <LessonCard data={ACTIVITIES.ACTIVITY_THREE} />
              </div>
              <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <LessonCard data={ACTIVITIES.ACTIVITY_FIVE} />
              </div>
            </div>
            <div style={{ flexDirection: "column", display: "flex", flex: 1 }}>
            <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <LessonCard data={ACTIVITIES.ACTIVITY_FOUR} />
              </div>
              <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <LessonCard data={ACTIVITIES.ACTIVITY_NINE} />
              </div>
              <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <LessonCard data={ACTIVITIES.ACTIVITY_SIX} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChoiceGrid;
