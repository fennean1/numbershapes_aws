import React, { Component, Text, useEffect } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import * as ACTIVITIES from "./Activities.js"
import Fab from "@material-ui/core/Fab";
import RecordVoiceOver from "@material-ui/icons/RecordVoiceOver";

export default function QuickImagePortal(props) {


  const { activity } = props.match.params
  const data = ACTIVITIES[activity]
  const [imgStyle,setImgStyle] = React.useState({height: "100%",width: "auto",margin: "1%"})
  const [imgContainerStyle,setImgContainerStyle] = React.useState({height: "93%",display: 'flex',flexDirection: "row",justifyContent: 'center'})
  const [tipsOpen, setTipsOpen] = React.useState(false)

  function printList(items) {
    if (items) { return items.map((q, i) => { return <p key={i}>{q}<br /><br /></p> }) }
  }

  useEffect(()=>{

    const windowListener = ()=>{
      if (window.innerHeight < 9/16*window.innerWidth){
        console.log("balls")
        setImgStyle({height: "100%",width: "auto",margin: "1%"})
        setImgContainerStyle({height: "93%",display: 'flex',flexDirection: "row",justifyContent: 'center'})
      } else {
        console.log("sack")
        setImgStyle({height: "auto",width: "100%",margin: "1%"})
        setImgContainerStyle({height: "93%",display: 'flex',flexDirection: "column"})
      }
    }
    window.addEventListener('resize',windowListener)

    return ()=>window.removeEventListener('resize',windowListener)
  },[])


  const toolLink  = (!data.NO_TOOL && <Link target="_blank" to = {{pathname: data.TOOL}}>
  <a  className="btn orange left"><i className="material-icons">build</i></a>
  </Link>)

  return (
    <div style={{ height: "100vh", flexDirection: "column" }}>
    <Drawer style = {{fontSize: "2vw",fontFamily: "Chalkboard SE"}} anchor="bottom" open={tipsOpen} onClose={() => setTipsOpen(false)}>
      <div className="flow-text" style={{ margin: 10, width: window.innerWidth / 3 }}>
        {printList(data.questions)}
      </div>
    </Drawer>
     <div style = {imgContainerStyle}>
      <img  className = "boxShadow" style = {imgStyle} src={require("./assets/"+ data.previewImg)}/>
      </div>
      <div style = {{margin: 10}}>
      <Fab style = {{position: "absolute",bottom: 20,left: 20}}onClick={() => setTipsOpen(true)}  color="secondary" aria-label="add">
        <RecordVoiceOver />
      </Fab>
      </div>
    </div>
  );
}  

