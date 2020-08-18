import React, { Component } from "react";
import "./App.css";
import Grid from "@material-ui/core/Grid";
import * as ACTIVITIES from "./Activities.js";
import QuickImageCard from "./QuickImageCard";
import AdCard from "./AdCard"

class QuickImages extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    return (
      <div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Grid container>
            <Grid xs={12} sm={4}>
              <div
                style={{
                  flexDirection: "column",
                  display: "flex-start",
                  flex: 1,
                }}
              >
                <div style={{ margin: 5, flex: 1 }}>
                  {" "}
                  <QuickImageCard data={ACTIVITIES.QI_7x7x7} />
                </div>
                <div style={{ margin: 5, flex: 1 }}>
                  {" "}
                  <QuickImageCard data={ACTIVITIES.QI_1000} />
                </div>
              </div>
            </Grid>
            <Grid xs={12} sm={4}>
              <div
                style={{
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  display: "flex-start",
                  flex: 1,
                }}
              >
                <div style={{ margin: 5, flex: 1 }}>
                  {" "}
                  <QuickImageCard data={ACTIVITIES.QI_MULT_7x5x6} />
                </div>
                <div style={{ margin: 5, flex: 1 }}>
                  {" "}
                  <QuickImageCard data={ACTIVITIES.QI_VA_1} />
                </div>
              </div>
            </Grid>
            <Grid xs={12} sm={4}>
              <div
                style={{
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  display: "flex-start",
                  flex: 1,
                }}
              >
                <div style={{ margin: 5, flex: 1 }}>
                  {" "}
                  <QuickImageCard data={ACTIVITIES.QI_MULT_7x5M2} />
                </div>
                <div style={{ margin: 5, flex: 1 }}>
                  {" "}
                  <QuickImageCard data={ACTIVITIES.QI_10x9_1} />
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
