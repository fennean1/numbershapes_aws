import React from 'react';
import {useLocation } from 'react-router';
import { BrowserRouter, Switch, Route, Link,Redirect} from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Landing from "./Login"
import Arena from './Arena'
import {userKeys} from "./js/keys.js"

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function ProtectedRoute(props) {
  const { match: { params } } = props;

  const path = props.match.path

  console.log('path',path)

  const localKey = window.localStorage.getItem('key')
  
  const loggedIn = userKeys[localKey]

  const renderMe = loggedIn ? <Arena fullscreen = {true} script = {props.script}/> : <Redirect to = {{
    pathname: "login",
    state: {request: path }
  }}/>
  
  return renderMe;
}