import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import LessonCard from "./LessonCard";
import { Switch, Route, Link } from "react-router-dom";
import * as ASSETS from "./AssetManager.js";
import * as ACTIVITIES from "./Activities.js";
import QuickImageCard from "./QuickImageCard";
import CardGameCard from "./CardGameCard";


import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


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
                <CardGameCard data={ACTIVITIES.MATCH_GAME_1_4} />
              </div>
            </div>
            </Grid>
            <Grid xs = {12} sm = {4} >
            <div style={{ flexDirection: "column", display: "flex-start", flex: 1 }}>
              <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <CardGameCard data={ACTIVITIES.MATCH_GAME_3_7} />
              </div>
            </div>
            </Grid>
          <Grid xs = {12} sm = {4} >
            <div style={{ flexDirection: "column", display: "flex-start", flex: 1 }}>
            <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <CardGameCard data={ACTIVITIES.MATCH_GAME_6_10} />
              </div>
            </div>
            </Grid>
            <Grid xs = {12} sm = {4} >
            <div style={{ flexDirection: "column", display: "flex-start", flex: 1 }}>
              <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <CardGameCard data={ACTIVITIES.NUMBERSHAPES_CRUSH} />
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
