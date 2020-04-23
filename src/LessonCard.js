import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AlarmIcon from "@material-ui/icons/Alarm";
import FaceIcon from "@material-ui/icons/Face";
import InfoIcon from "@material-ui/icons/Info";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Popover from "@material-ui/core/Popover";
import * as ASSETS from "./AssetManager.js"
import { promises } from "fs";



let BLUE_OBJECTS = ASSETS.BLUE_OBJS() 

const useStyles = makeStyles(theme => ({
  card: {
    fontFamily: "Chalkboard SE"
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  title: {
    fontFamily: "Chalkboard SE"
  },
  avatar: {
    backgroundColor: red[500]
  },
  typography: {
    padding: theme.spacing(2)
  }
}));

export default function LessonCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleExpandClick() {
    setExpanded(!expanded);
  }

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Card  style = {{borderWidth: 40,borderColor: 0x000000}} className={classes.card}>
      <CardHeader classes = {{title: classes.title}} title={props.data.title}
      />
      <CardMedia
        className={classes.media}
        image={require("./assets/"+ props.data.previewImg)}
      />
      <CardContent>
        <Typography className={classes.typography}>
          {props.data.activityDescription}
        </Typography>
        {props.data.shortText}
      </CardContent>
      <CardActions disableSpacing>
        <Link style={{ textDecoration: 'none' }} target = "_blank" to={""+props.data.tool}>
          <Button variant = "outlined" >Start</Button>
        </Link>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="h6">Getting Started</Typography>
          <Typography paragraph> {props.data.coreSkillDescription}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
