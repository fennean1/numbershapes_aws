import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
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
      <div >
        <div style = {{display: "flex",flexDirection: 'column'}} >
        <Grid  container>
          <Grid xs = {12} sm = {4} >
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
            </Grid>
            <Grid xs = {12} sm = {4} >
            <div style={{ flexDirection: "column", display: "flex", flex: 1 }}>
            <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <LessonCard data={ACTIVITIES.NUMBER_CARDS} />
              </div>
            <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <LessonCard data={ACTIVITIES.ACTIVITY_SEVEN} />
              </div>
              <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <LessonCard data={ACTIVITIES.ACTIVITY_FIVE} />
              </div>
            </div>
            </Grid>
            <Grid xs = {12} sm = {4} >
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
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default ChoiceGrid;
