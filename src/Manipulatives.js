import React, { Component } from "react";
import "./App.css";
import Grid from "@material-ui/core/Grid";
import ManipulativeCard from "./ManipulativeCard";
import * as ACTIVITIES from "./Activities.js";
import Feedback from "feeder-react-feedback"; // import Feedback component
import "feeder-react-feedback/dist/feeder-react-feedback.css"; // import stylesheet


export default class Manipulatives extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="clouds">
        <div className="container" style={{ paddingTop: 20 }}>
        <a target = "_blank" href = "https://khlink.net/3nOmZ0f">
            <img className = "header" src={require("./assets/KnowledgehookLogo.png")} />
          </a>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Grid container>
              <Grid xs={12} item={true} sm={6}>
                <div
                  style={{ flexDirection: "column", display: "flex", flex: 1 }}
                >
                  <div style={{ margin: 5, flex: 1 }}>
                    {" "}
                    <ManipulativeCard data={ACTIVITIES.MULTIPLICATION_GRID} />
                  </div>
                </div>
              </Grid>
              <Grid xs={12} item={true} sm={6}>
                <div
                  style={{ flexDirection: "column", display: "flex", flex: 1 }}
                >
                  <div style={{ margin: 5, flex: 1 }}>
                    <ManipulativeCard data={ACTIVITIES.PRIME_LINE} />
                  </div>
                </div>
              </Grid>
              <Grid xs={12} item={true} sm={6}>
                <div
                  style={{ flexDirection: "column", display: "flex", flex: 1 }}
                >
                  <div style={{ margin: 5, flex: 1 }}>
                    {" "}
                    <ManipulativeCard data={ACTIVITIES.RAINBOW_ARRAYS} />
                  </div>
                </div>
              </Grid>
              <Grid xs={12} item={true} sm={6}>
                <div
                  style={{ flexDirection: "column", display: "flex", flex: 1 }}
                >
                  <div style={{ margin: 5, flex: 1 }}>
                    <ManipulativeCard data={ACTIVITIES.RELATIONAL_CIRCLES} />
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
          <Feedback style = {{height: 1000}}email = {true} projectId="5f63dca7515e130004737f5c" />
        </div>
      </div>
    );
  }
}
