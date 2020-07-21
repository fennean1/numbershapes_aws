import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import * as ACTIVITIES from "./Activities.js";
import QuickImageCard from "./QuickImageCard";
import CardGameCard from "./CardGameCard";



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
          <Grid xs = {12} item = {true} sm = {4} >
            <div style={{ flexDirection: "column", display: "flex-start", flex: 1 }}>
              <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <CardGameCard data={ACTIVITIES.MATCH_GAME_1_4} />
              </div>
            </div>
            </Grid>
            <Grid xs = {12} item = {true} sm = {4} >
            <div style={{ flexDirection: "column", display: "flex-start", flex: 1 }}>
              <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <CardGameCard data={ACTIVITIES.MATCH_GAME_3_7} />
              </div>
            </div>
            </Grid>
          <Grid xs = {12} item = {true}  sm = {4} >
            <div style={{ flexDirection: "column", display: "flex-start", flex: 1 }}>
            <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <CardGameCard data={ACTIVITIES.MATCH_GAME_6_10} />
              </div>
            </div>
            </Grid>
          </Grid>
        </div>
        
      </div>
    );
  }
}

export default QuickImages;
