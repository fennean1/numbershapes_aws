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

const useStyles = makeStyles(theme => ({
  card: {},
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
  avatar: {
    backgroundColor: red[500]
  },
  typography: {
    padding: theme.spacing(2)
  }
}));

export default function AppCard(props) {
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
    <Card className={classes.card}>
      <CardHeader
        title={props.data.title}
        subheader={
          props.data.track + ": " + props.data.duration + " " + "minutes"
        }
        action={
          <div>
            <Button onClick={handleClick}>{props.data.standardID}</Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left"
              }}
            >
              <Typography className={classes.typography}>
                {props.data.standardDescription}
              </Typography>
            </Popover>
          </div>
        }
      />
      <CardMedia
        className={classes.media}
        image={require("./assets/" + props.data.previewImg)}
      />
      <CardContent>
        <Typography className={classes.typography}>
          {props.data.activityDescription}
        </Typography>
        {props.data.tags[0] != "" && <Chip label={props.data.tags[0]} />}
        {props.data.tags[1] != "" && <Chip label={props.data.tags[1]} />}
        {props.data.tags[2] != "" && <Chip label={props.data.tags[2]} />}
      </CardContent>
      <CardActions disableSpacing>
        <Link to="/activitypage">
          <Button>Open</Button>
        </Link>

        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="Show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="h6">Core Skill</Typography>
          <Typography paragraph> {props.data.coreSkillDescription}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
