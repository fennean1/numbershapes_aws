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
import QuickImageCard from "./QuickImageCard";

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
          <div style={{ flexDirection: "row", display: "flex" }}>
            <div style={{ flexDirection: "column", display: "flex-start", flex: 1 }}>
              <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <QuickImageCard data={ACTIVITIES.QI_1000} />
              </div>
              <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <QuickImageCard  data={ACTIVITIES.QI_10x9_1} />
              </div>
            </div>
            <div style={{ flexDirection: "column", justifyContent: "flex-start", display: "flex-start", flex: 1 }}>
            <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <QuickImageCard  data={ACTIVITIES.QI_MULT_7x5x6} />
              </div>
              <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <QuickImageCard data={ACTIVITIES.QI_VA_1} />
              </div>
            </div>
            <div style={{ flexDirection: "column", justifyContent: "flex-start", display: "flex-start", flex: 1 }}>
              <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <QuickImageCard data={ACTIVITIES.QI_MULT_7x5M2} />
              </div>
              <div style={{ margin: 5, flex: 1 }}>
                {" "}
                <QuickImageCard data={ACTIVITIES.QI_OOP} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default QuickImages;
