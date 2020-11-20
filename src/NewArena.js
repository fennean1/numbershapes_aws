import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import "./App.css";

class Arena extends Component {
  constructor() {
    super();
    this.app = {};
    this.dialog = React.createRef()
    this.state = {
      open: false,
      text: "Balls"
    };
  }


  handleClickOpen(){
    this.setState({open: true})
  };

  onChange(event){
    this.setState({text: event.target.value})
    this.app.updateActiveTextBox(event.target.value)
  }

  handleClose(){
    if (this.state.text == ""){
      this.setState({text: "Text"})
      this.app.updateActiveTextBox("Text")
    }
    this.setState({open: false})
  };

  componentWillUnmount() {
    this.app.destroy(true);
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
    const setup = {
      height: this.gameCanvas.clientHeight,
      width: this.gameCanvas.clientWidth,
      props: this.props,
      arena: this,
    };

    this.app = this.props.script(this.gameCanvas, setup);

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
          ref={this.dialog}
          open={this.state.open}
          onClose={this.handleClose.bind(this)}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit Text</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              value = {this.state.text}
              onChange = {this.onChange.bind(this)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              Done
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Arena;
