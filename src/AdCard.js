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
import RecordVoiceOver from "@material-ui/icons/RecordVoiceOver";
import AlarmIcon from "@material-ui/icons/Alarm";
import FaceIcon from "@material-ui/icons/Face";
import InfoIcon from "@material-ui/icons/Info";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Popover from "@material-ui/core/Popover";

import { promises } from "fs";

const useStyles = makeStyles((theme) => ({
  card: {
    fontFamily: "Chalkboard SE",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
    margin: 10,
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  title: {
    fontFamily: "Chalkboard SE",
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  typography: {
    padding: theme.spacing(2),
  },
}));

export default function QuickImageCard(props) {
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

  function printList(items) {
    if (items) {
      return items.map((q, i) => {
        return (
          <p key={i}>
            {q}
            <br />
            <br />
          </p>
        );
      });
    }
  }

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Card
      style={{ borderWidth: 40, borderColor: 0x000000 }}
      className={classes.card}
    >
      <div style = {{display: "flex",flexDirection: 'row',padding: 20,height: 340}}>
      <div style = {{display: "flex",flexDirection: 'column',margin: 'auto'}}>
        <iframe
          style={{
            flexGrow: 1,
            display: "block",
            margin: 'auto'
          }}
          scrolling="no"
          frameborder="0"
          src="//ws-na.amazon-adsystem.com/widgets/q?ServiceVersion=20070822&OneJS=1&Operation=GetAdHtml&MarketPlace=US&source=ac&ref=tf_til&ad_type=product_link&tracking_id=numbershapes-20&marketplace=amazon&region=US&placement=B07532CY98&asins=B07532CY98&linkId=0b4109d85645aab698939a95dabf336d&show_border=false&link_opens_in_new_window=false&price_color=333333&title_color=0066c0&bg_color=ffffff"
        ></iframe>
        </div>
      </div>
    </Card>
  );
}
