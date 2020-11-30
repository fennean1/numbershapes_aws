import React from 'react';
import {Link } from "react-router-dom";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import logo from "./assets/favicon.png"


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

export default function Login(props) {
  const classes = useStyles();
  const [text,setText] = React.useState('User Code')

  
  function onSubmit(){
    console.log("onsubmit")
    window.localStorage.setItem('key',text)
  }

  const linkTo = props.location.state ? props.location.state.request + "/" + window.localStorage.getItem('key') : '/'
  
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
        <img src={logo} alt="Logo" />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
          <TextField
            margin="normal"
            required
            onChange = {e=>setText(e.target.value)}
            className = "blue-outline"
            fullWidth
            value = {text}
            id="User Code"
            label="User Code"
            name="User Code"
            autoFocus
          />
          <Link to = {linkTo}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick = {onSubmit}
          >
            Sign In
          </Button>
          </Link>
      </div>
    </Container>
  );
}