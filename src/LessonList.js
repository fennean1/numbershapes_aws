import React, { Component } from "react";
import ReactDOM from "react-dom";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import logo from "./logo.svg";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import { Switch, Route, Link } from "react-router-dom";

import LessonCard from "./LessonCard";

import * as LessonOne from "./activities/LessonOne.json";
import * as LessonTwo from "./activities/LessonTwo.json";

class LessonList extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //this.setState({ Activity: ActivityOne.default });
  }

  render() {
    return (
      <div className = "container">
          <h2 className = "center"> Lessons </h2>
        <div className="row">
          <div className="col s6">
            <LessonCard data={LessonOne} />
          </div>
          <div className="col s6">
            <LessonCard data={LessonTwo} />
          </div>
 
        </div>
      </div>
    );
  }
}

export default LessonList;
