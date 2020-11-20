import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import "./App.css";

import * as PIXI from "pixi.js-legacy";

class Arena extends Component {
  constructor() {
    super();
    this.app = {};
    this.state = {
      open: false,
      openMoreInfo: false,
    };
  }

  handleClickOpen() {
    this.setState({ open: true });
  }

  handleInfoOpen() {
    this.setState({ openMoreInfo: true });
  }

  handleInfoClose() {
    this.setState({ openMoreInfo: false});
  }

  onChange(event) {
    this.setState({ text: event.target.value });
    this.app.updateActiveTextBox(event.target.value);
  }

  handleClose() {
    if (this.state.text == "") {
      this.setState({ text: "Text" });
      this.app.updateActiveTextBox("Text");
    }
    this.setState({ open: false });
  }

  componentWillUnmount() {
    this.app.destroy(true);
  }

  componentWillMount() {
    PIXI.settings.RESOLUTION = 2;
    this.app = new PIXI.Application({ forceCanvas: true });
    this.app.renderer.backgroundColor = 0xffffff;
    this.app.renderer.resolution = 2;
    this.app.renderer.autoDensity = true;
  }

  loadInstructions() {
    this.setState({ open: true });
  }

  resize() {
    this.app.resize({
      width: this.gameCanvas.clientWidth,
      height: this.gameCanvas.clientHeight,
    });
  }

  componentDidMount() {
    this.gameCanvas.appendChild(this.app.view);

    const setup = {
      height: this.gameCanvas.clientHeight,
      width: this.gameCanvas.clientWidth,
      props: this.props,
      arena: this,
    };

    this.app.renderer.resize(
      this.gameCanvas.clientWidth,
      this.gameCanvas.clientHeight
    );

    this.props.script(this.app, setup);

    window.addEventListener("resize", () => this.resize());
  }

  // Need fullscreen prop
  render() {
    let styleType = this.props.fullscreen ? { height: "100vh" } : null;
    return (
      <div>
        <div
          style={styleType}
          ref={(me) => {
            this.gameCanvas = me;
          }}
        />
        <Dialog
          open={this.state.open}
          onClose={this.handleClose.bind(this)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit Text</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              value={this.state.text}
              onChange={this.onChange.bind(this)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              Done
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={this.state.openMoreInfo}
          onClose={this.handleInfoClose.bind(this)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"Welcome To The Prime Line!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              The Prime Line is a special collaboration between Math For Love's Award-Winning Board Game "Prime Climb"
              and Knowledgehook's new innovative Virtual Manipulatives! Learn more about our unique products using the links below!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button className = "red" target = "_blank" href = "https://www.knowledgehook.com/" color="primary">
              Knowledgehook
            </Button>
            <Button target = "_blank" href = "https://mathforlove.com/" color="secondary">
              Math For Love
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Arena;
