import React, { Component } from "react";
import "./App.css";
import LessonCard from "./LessonCard";
import * as Subitization from "./activities/Subitization.json";
import * as Addition from "./activities/Addition.json";
import * as Subtraction from "./activities/Subtraction.json";
import * as Pivot from "./activities/Pivot.json";


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
            <LessonCard data={Subitization} />
          </div>
          <div className="col s6">
            <LessonCard data={Subtraction} />
          </div>
          </div>
          <div className="row">
          <div className="col s6">
            <LessonCard data={Addition} />
          </div>
          <div className="col s6">
            <LessonCard data={Pivot} />
          </div>
         </div> 
      </div>
    );
  }
}

export default LessonList;
