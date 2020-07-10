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
import Printables from "./Printables";
import QuickImageCard from "./QuickImageCard";


function TabContainer({ children, dir }) {
  return (
    <div component="div" dir={dir}>
      {children}
    </div>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500
  }
}));

export default function ConceptsCarousel(props) {

  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const {path} = props.match

  function handleChange(event, newValue) {
    if (newValue == 0){
      props.history.push("/content/games")
    } else if (newValue == 1){
      props.history.push("/content/activities")
    } else if (newValue == 2){
      props.history.push("/content/images")
    } else if (newValue == 3){
    props.history.push("/content/printables")
  }
    setValue(newValue);
  }


  function handleChangeIndex(index) {
    setValue(index);
  }

  const routes = () => <Switch>
  <Route exact path={"/"} component={CardGames} />
  <Route exact path={"/content/activities"} component={ChoiceGrid} />
  <Route exact path ={"/content/games"} component={CardGames} />
  <Route exact path ={"/content/images"} component={QuickImages} />
  <Route exact path ={"/content/printables"} component={Printables} />
</Switch>

  return (
  <div className="clouds" style = {{display: "flex",flexDirection: 'column'}}>
    <div className = "container" style = {{marginTop: 50}}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          variant = "fullWidth"
          centered
          style = {{color: "#000000"}}>
          <Tab style = {{fontSize: "2vw",fontFamily: "Chalkboard SE"}} className = "white" label= "Games" />
          <Tab style = {{fontSize: "2vw",fontFamily: "Chalkboard SE"}} className = "white" label= "Interactives" />
          <Tab style = {{fontSize: "2vw",fontFamily: "Chalkboard SE"}} className = "white" label= "Quick Images" />
          <Tab style = {{fontSize: "2vw",fontFamily: "Chalkboard SE"}} className = "white" label= "Printables" />
        </Tabs>

      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
              <TabContainer dir={theme.direction}>
          {value == 0 && (
             routes()
          )}
        </TabContainer>
        <TabContainer dir={theme.direction}>
          {value == 1 && (
               routes()
          )}
        </TabContainer>
        <TabContainer dir={theme.direction}>
          {value == 2 && (
               routes()
          )}
        </TabContainer>
        <TabContainer dir={theme.direction}>
          {value == 3 && (
               routes()
          )}
        </TabContainer>
      </SwipeableViews>
    </div>
    </div>
  );
}


/*

      <TabContainer dir={theme.direction}>
          {value == 0 && (
            <CardGames/>
          )}
        </TabContainer>
        <TabContainer dir={theme.direction}>
          {value == 1 && (
            <ChoiceGrid/>
          )}
        </TabContainer>
        <TabContainer dir={theme.direction}>
          {value == 2 && (
            <QuickImages/>
          )}
        </TabContainer>

 <Switch>
            <Route path={`${path}`} exact component={Profile} />
            <Route path={`${path}/comments`} component={Comments} />
            <Route path={`${path}/contact`} component={Contact} />
          </Switch>
*/