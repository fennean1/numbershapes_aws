import Zero from "./assets/num-zero.png";
import One from "./assets/num-one.png";
import Two from "./assets/num-two.png";
import Three from "./assets/num-three.png";
import Four from "./assets/num-four.png";
import Five from "./assets/num-five.png";
import Six from "./assets/num-six.png";
import Seven from "./assets/num-seven.png";
import Eight from "./assets/num-eight.png";
import Nine from "./assets/num-nine.png";
import Ten from "./assets/num-ten.png";



// Blue Cards
import One_B from "./assets/One_B.png";
import Two_B from "./assets/Two_B.png";
import Three_B from "./assets/Three_B.png";
import Four_B from "./assets/Four_B.png";
import Five_B from "./assets/Five_B.png";
import Six_B from "./assets/Six_B.png";
import Seven_B from "./assets/Seven_B.png";
import Eight_B from "./assets/Eight_B.png";
import Nine_B from "./assets/Nine_B.png";
import Ten_B from "./assets/Ten_B.png";


// Red Cards
import One_R from "./assets/One_R.png";
import Two_R from "./assets/Two_R.png";
import Three_R from "./assets/Three_R.png";
import Four_R from "./assets/Four_R.png";
import Five_R from "./assets/Five_R.png";
import Six_R from "./assets/Six_R.png";
import Seven_R from "./assets/Seven_R.png";
import Eight_R from "./assets/Eight_R.png";
import Nine_R from "./assets/Nine_R.png";
import Ten_R from "./assets/Ten_R.png";

// Green Cards
import One_G from "./assets/One_G.png";
import Two_G from "./assets/Two_G.png";
import Three_G from "./assets/Three_G.png";
import Four_G from "./assets/Four_G.png";
import Five_G from "./assets/Five_G.png";
import Six_G from "./assets/Six_G.png";
import Seven_G from "./assets/Seven_G.png";
import Eight_G from "./assets/Eight_G.png";
import Nine_G from "./assets/Nine_G.png";
import Ten_G from "./assets/Ten_G.png";


// Pink Cards
import One_Pi from "./assets/One_Pi.png";
import Two_Pi from "./assets/Two_Pi.png";
import Three_Pi from "./assets/Three_Pi.png";
import Four_Pi from "./assets/Four_Pi.png";
import Five_Pi from "./assets/Five_Pi.png";
import Six_Pi from "./assets/Six_Pi.png";
import Seven_Pi from "./assets/Seven_Pi.png";
import Eight_Pi from "./assets/Eight_Pi.png";
import Nine_Pi from "./assets/Nine_Pi.png";
import Ten_Pi from "./assets/Ten_Pi.png";


// Purple Cards
import One_P from "./assets/One_P.png";
import Two_P from "./assets/Two_P.png";
import Three_P from "./assets/Three_P.png";
import Four_P from "./assets/Four_P.png";
import Five_P from "./assets/Five_P.png";
import Six_P from "./assets/Six_P.png";
import Seven_P from "./assets/Seven_P.png";
import Eight_P from "./assets/Eight_P.png";
import Nine_P from "./assets/Nine_P.png";
import Ten_P from "./assets/Ten_P.png";

// Orange Cards
import One_O from "./assets/One_O.png";
import Two_O from "./assets/Two_O.png";
import Three_O from "./assets/Three_O.png";
import Four_O from "./assets/Four_O.png";
import Five_O from "./assets/Five_O.png";
import Six_O from "./assets/Six_O.png";
import Seven_O from "./assets/Seven_O.png";
import Eight_O from "./assets/Eight_O.png";
import Nine_O from "./assets/Nine_O.png";
import Ten_O from "./assets/Ten_O.png";


import RedBall from "./assets/RedBall.png"
import BlueBall from "./assets/BlueBall.png"
import PinkBall from "./assets/PinkBall.png"
import PurpleBall from "./assets/PurpleBall.png"
import OrangeBall from "./assets/OrangeBall.png"
import GreenBall from "./assets/GreenBall.png"


// Dots
import RedDot from "./assets/RedCritterSphere.png"
import BlueDot from "./assets/BlueCritterSphere.png"
import PinkDot from "./assets/PinkCritterSphere.png"
import PurpleDot from "./assets/PurpleCritterSphere.png"
import OrangeDot from "./assets/OrangeCritterSphere.png"
import GreenDot from "./assets/GreenCritterSphere.png"



// Buttons
import PlayAgain from "./assets/PlayAgain.png"
import Home from "./assets/Home.png"


export const BALLS = [BlueBall,RedBall,PinkBall,PurpleBall,GreenBall,OrangeBall]

export const BUTTONS = {
  PLAY_AGAIN: PlayAgain,
  HOME: Home
}

const BLUES = [
  One_B,
  Two_B,
  Three_B,
  Four_B,
  Five_B,
  Six_B,
  Seven_B,
  Eight_B,
  Nine_B,
  Ten_B
];

const PINKS = [
  One_Pi,
  Two_Pi,
  Three_Pi,
  Four_Pi,
  Five_Pi,
  Six_Pi,
  Seven_Pi,
  Eight_Pi,
  Nine_Pi,
  Ten_Pi
];

const PURPLES = [
  One_P,
  Two_P,
  Three_P,
  Four_P,
  Five_P,
  Six_P,
  Seven_P,
  Eight_P,
  Nine_P,
  Ten_P
];

const REDS = [
  One_R,
  Two_R,
  Three_R,
  Four_R,
  Five_R,
  Six_R,
  Seven_R,
  Eight_R,
  Nine_R,
  Ten_R
];

const GREENS = [
  One_G,
  Two_G,
  Three_G,
  Four_G,
  Five_G,
  Six_G,
  Seven_G,
  Eight_G,
  Nine_G,
  Ten_G
];

const ORANGES = [
  One_O,
  Two_O,
  Three_O,
  Four_O,
  Five_O,
  Six_O,
  Seven_O,
  Eight_O,
  Nine_O,
  Ten_O
];

export const NUMBERS = [
  Zero,
  One,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten
]

export const DOTS = {
  BLUE: BlueDot,
  RED: RedDot,
  GREEN: GreenDot, 
  ORANGE: OrangeDot,
  PINK: PinkDot,
  PURPLE: PurpleDot
}

export const BLUE_OBJS = () => {return BLUES.map((e,i) => {return {img: e,value:i+1}})}
export const ORANGE_OBJS = () => {return ORANGES.map((e,i) => {return {img: e,value:i+1}})}
export const RED_OBJS = () => {return REDS.map((e,i) => {return {img: e,value:i+1}})}
export const GREEN_OBJS = () => {return GREENS.map((e,i) => {return {img: e,value:i+1}})}
export const PURPLE_OBJS = () => {return PURPLES.map((e,i) => {return {img: e,value:i+1}})}
export const PINK_OBJS = () => {return PINKS.map((e,i) => {return {img: e,value:i+1}})}
export const NUMERAL_OBJS = () => {return NUMBERS.map((e,i) => {return {img: e,value:i+1}})}


export const BLUE = BLUE_OBJS()
export const RED = RED_OBJS()
export const PINK = PINK_OBJS()
export const PURPLE = PURPLE_OBJS()
export const GREEN = GREEN_OBJS()
export const ORANGE = ORANGE_OBJS()
export const NUMERAL = NUMERAL_OBJS()

