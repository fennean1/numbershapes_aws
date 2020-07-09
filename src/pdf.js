import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Switch, Route, Link} from "react-router-dom";
import {BrowserHistory} from 'react-router'
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import QuickImages from './QuickImages';
import Activities from './ChoiceGrid';
import ChoiceGrid from "./ChoiceGrid";
import CardGames from "./CardGames";
import QuickImageCard from "./QuickImageCard";

import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


export default function Pdf(props) {

  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const {path} = props.match

  return (
  <div style = {{display: "flex",flexDirection: 'column'}}>
        <Document  file= "Addition.pdf">
          <Page width = {window.innerWidth} pageNumber = {1} />
        </Document>
    </div>
  );
}

