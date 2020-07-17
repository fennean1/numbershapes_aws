import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Grid from "@material-ui/core/Grid";
import LessonCard from "./LessonCard";
import * as ACTIVITIES from "./Activities.js";

export default class Interactives extends Component {
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
                <LessonCard data={ACTIVITIES.SPACE_BUBBLES} />
              </div>
              <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <LessonCard data={ACTIVITIES.FACTOR_WALL} />
              </div>
            </div>
            </Grid>
            <Grid xs = {12} sm = {4} >
            <div style={{ flexDirection: "column", display: "flex", flex: 1 }}>
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
                <LessonCard data={ACTIVITIES.ACTIVITY_FOUR} />
              </div>
            </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

