import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Grid from "@material-ui/core/Grid";
import InteractiveCard from "./InteractiveCard";
import * as ACTIVITIES from "./Activities.js";

export default class Interactives extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div >
        <div style = {{display: "flex",flexDirection: 'column'}} >
        <Grid  container>
          <Grid xs = {12} item = {true}  sm = {4} >
            <div style={{ flexDirection: "column", display: "flex", flex: 1 }}>
            <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <InteractiveCard  data={ACTIVITIES.STRIP_ESTIMATE} />
              </div>
            </div>
            </Grid>
            <Grid xs = {12} item = {true}  sm = {4} >
            <div style={{ flexDirection: "column", display: "flex", flex: 1 }}>
            <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <InteractiveCard  data={ACTIVITIES.BUBBLE_TARGET} />
              </div>
            </div>
            </Grid>
            <Grid xs = {12} item = {true} sm = {4} >
            <div style={{ flexDirection: "column", display: "flex", flex: 1 }}>

            </div>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

