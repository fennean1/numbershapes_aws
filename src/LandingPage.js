import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { BrowserHistory } from "react-router";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import QuickImages from "./QuickImages";
import Interactives from "./Interactives";
import Tasks from "./Tasks";
import Apps from "./Apps";
import CardGames from "./CardGames";
import Printables from "./Printables";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import RestoreIcon from "@material-ui/icons/Restore";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LocationOnIcon from "@material-ui/icons/LocationOn";

function TabContainer({ children, dir }) {
  return (
    <div component="div" dir={dir}>
      {children}
    </div>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    flexShrink: 0,
  },
}));

export default function ConceptsCarousel(props) {
  const theme = useTheme();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [bottomTabValue, setBottomTabValue] = React.useState(0);
  const { path } = props.match;

  function handleChange(event, newValue) {
    if (newValue == 0) {
      props.history.push("/content/tasks");
    } else if (newValue == 1) {
      props.history.push("/content/images");
    } else if (newValue == 2) {
      props.history.push("/content/interactives");
    } else if (newValue == 3) {
      props.history.push("/content/apps");
    }
    setValue(newValue);
  }

  function handleChangeIndex(index) {
    let newValue = index;
    if (newValue == 0) {
      props.history.push("/content/tasks");
    } else if (newValue == 1) {
      props.history.push("/content/images");
    } else if (newValue == 2) {
      props.history.push("/content/interactives");
    } else if (newValue == 3) {
      props.history.push("/content/apps");
    }
    setValue(index);
  }

  const routes = () => (
    <Switch>
      <Route exact path={"/"} component={Tasks} />
      <Route exact path={"/content/interactives"} component={Interactives} />
      <Route exact path={"/content/images"} component={QuickImages} />
      <Route exact path={"/content/apps"} component={Apps} />
      <Route exact path={"/content/tasks"} component={Tasks} />
    </Switch>
  );

  return (
    <div
      className="clouds"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div className="container" style={{ marginTop: 50 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="on"
          className="clear"
          style={{ display: "flex", flexDirection: "row" }}
        >
          <Tab
            style={{
              flex: 1,
              margin: 5,
              fontSize: "2vw",
              fontFamily: "Chalkboard SE",
              borderRadius: 8,
            }}
            className="white"
            label="Tasks"
          />
          <Tab
            style={{
              flex: 1,
              margin: 5,
              fontSize: "2vw",
              fontFamily: "Chalkboard SE",
              borderRadius: 8,
            }}
            className="white"
            label="Images"
          />
          <Tab
            style={{
              flex: 1,
              margin: 5,
              fontSize: "2vw",
              fontFamily: "Chalkboard SE",
              borderRadius: 8,
            }}
            className="white"
            label="Interactives"
          />
          <Tab
            style={{
              flex: 1,
              margin: 5,
              fontSize: "2vw",
              fontFamily: "Chalkboard SE",
              borderRadius: 8,
            }}
            className="white"
            label="Apps"
          />
        </Tabs>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabContainer dir={theme.direction}>
            {value == 0 && routes()}
          </TabContainer>
          <TabContainer dir={theme.direction}>
            {value == 1 && routes()}
          </TabContainer>
          <TabContainer dir={theme.direction}>
            {value == 2 && routes()}
          </TabContainer>
          <TabContainer dir={theme.direction}>
            {value == 3 && routes()}
          </TabContainer>
        </SwipeableViews>
      </div>
    </div>
  );
}
