import React, { Component } from "react";
import { Editor, EditorState } from "draft-js";
import { convertFromRaw, convertToRaw } from "draft-js";

import { Switch, Route } from "react-router-dom";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
    this.onChange = editorState => this.setState({ editorState });
  }

  render() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    let content = convertToRaw(this.state.editorState.getCurrentContent())
      .blocks[0].text;

    console.log(content);

    return (
      <div>
        <AppCard />
      </div>
    );
  }
}

export default Home;
