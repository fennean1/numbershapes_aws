import React, { Component } from "react";
import ReactDOM from "react-dom";

import logo from "./logo.svg";
import $ from "jquery";
import { Button, Icon, Card, CardTitle, Row, Col } from "react-materialize";
import { Stage, Layer, Rect, Text, Star } from "react-konva";
import Konva from "konva";
import { Parallax } from "react-scroll-parallax";
import materialize from "materialize-css";
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
      <div className="editor">
        <Editor editorState={this.state.editorState} onChange={this.onChange} />
        <Text>This is what you are typing: {content}</Text>
      </div>
    );
  }
}

export default Home;