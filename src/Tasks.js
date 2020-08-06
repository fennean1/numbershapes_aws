import React, { Component } from "react";
import "./App.css";
import Grid from "@material-ui/core/Grid";
import * as ACTIVITIES from "./Activities.js";
import TaskCard from "./TaskCard";

class QuickImages extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return (
      <div>
        <div style = {{display: "flex",flexDirection: 'column'}}>
          <Grid  container>
          <Grid xs = {12} sm = {4} >
            <div style={{ flexDirection: "column", display: "flex-start", flex: 1 }}>
            <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <TaskCard data={ACTIVITIES.dot_rate_problem} />
              </div>
            </div>
            </Grid>
            <Grid xs = {12} sm = {4} >
            <div style={{ flexDirection: "column", justifyContent: "flex-start", display: "flex-start", flex: 1 }}>
            </div>
            </Grid>
            <Grid xs = {12} sm = {4}>
            <div style={{ flexDirection: "column", justifyContent: "flex-start", display: "flex-start", flex: 1 }}>
            </div>
          </Grid>
          </Grid>
        </div>
        
      </div>
    );
  }
}

export default QuickImages;
