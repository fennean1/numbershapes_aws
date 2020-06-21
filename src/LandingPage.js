import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import QuickImages from './QuickImages';
import Activities from './ChoiceGrid';
import ChoiceGrid from "./ChoiceGrid";
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


  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function handleChangeIndex(index) {
    setValue(index);
  }

  return (
    <div className="clouds" style = {{display: "flex",flexDirection: 'column'}}>
<Typography style = {{flex: 1,fontSize: "5.5vw",display: "flex", margin: "auto",padding: 20,fontFamily: "Chalkboard SE"}} variant="h2" component="h2">
Welcome!
</Typography>
<Link style={{ textDecoration: 'none',margin: "auto",display: "flex"}} target = "_blank" to={"/NumberCardStock.pdf"}>
          <Button color = "secondary" variant = "contained"><Typography style = {{flex: 1,fontSize: "1.5vw",display: "flex", margin: "auto",padding: 20,fontFamily: "Chalkboard SE"}} variant="h2" component="h2">
Number Cards
</Typography></Button>
        </Link>
   <div className = "container">
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="green"
        variant = "fullWidth"
        centered
        style = {{color: "#000000"}}
        

      >
        <Tab style = {{fontSize: "3.5vw",fontFamily: "Chalkboard SE"}} className = "white" label= "Activities" />
        <Tab style = {{fontSize: "3.5vw",fontFamily: "Chalkboard SE"}} className = "white" label= "Quick Images" />
      </Tabs>

      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabContainer dir={theme.direction}>
          {value == 0 && (
            <ChoiceGrid/>
          )}
        </TabContainer>
        <TabContainer dir={theme.direction}>
          {value == 1 && (
            <QuickImages/>
          )}
        </TabContainer>
      </SwipeableViews>
    </div>
    </div>
  );
}
