import React, { useEffect, useState, useContext } from "react";
import {WappContext} from "wapplr-react/dist/common/Wapp";
import getUtils from "wapplr-react/dist/common/Wapp/getUtils";

import style from "./app.css";
import fontsStyle from "../../fonts/fonts.css";

import Template from "../Template";
import Game from "../Game";
import About from "../About";
import Log from "../Log";

export default function App(props) {

    const context = useContext(WappContext);
    const {wapp} = context;
    const utils = getUtils(context);
    const {subscribe} = props;

    const templateFunctions = {};
    const gameFunctions = {};

    wapp.styles.use(fontsStyle);
    wapp.styles.use(style);

    const [url, setUrl] = useState(utils.getRequestUrl());

    function onLocationChange(newUrl){
        if (url !== newUrl){
            setUrl(newUrl);
        }
    }

    function scrollTo(id) {
        const section = document.getElementById(id);
        if (section || id === "home") {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth"
            });
            if (id === "highscores"){
                templateFunctions.setHeaderLogoType({hidden: false, disableControlOnScroll: true})
            }
            if (id === "about"){
                templateFunctions.setHeaderLogoType({hidden: false, disableControlOnScroll: true})
            }
            if (id === "home"){
                templateFunctions.setHeaderLogoType({hidden: true, disableControlOnScroll: false})
            }
        }
    }

    function onStart() {
        templateFunctions.setHeaderLogoType({hidden: false, disableControlOnScroll: true})
    }

    function onBackToTheStart(e) {
        templateFunctions.setHeaderLogoType({hidden: true, disableControlOnScroll: false})
    }

    useEffect(function (){
        scrollTo(url.slice(1) || "home")
        const unsub = subscribe.locationChange(onLocationChange);
        return function useUnsubscribe(){
            unsub();
        }
    }, [url])

    return (
        <Template
                  effect={function (current) {
                      templateFunctions.setHeaderLogoType = current.setLogoType;
                  }}
                  logoOnClick={function (e){
                      if (gameFunctions.backToTheStart) {
                          gameFunctions.backToTheStart(e);
                      } else {
                          e.preventDefault();
                          wapp.client.history.push({
                              search:"",
                              href:"",
                              pathname: "/"
                          });
                      }
                  }}
        >
            <Log effect={function (logFunctions){
                templateFunctions.clearLog = function (){
                    logFunctions.clear()
                }
                templateFunctions.showLog = function (){
                    logFunctions.show()
                }
                templateFunctions.hideLog = function (){
                    logFunctions.hide()
                }
            }} />
            <div className={style.sections}>
                {(url === "/about") ?
                    <section className={style.section + " " + style.about} id={"about"}>
                        <About devModeHandle={function (devMode) {
                            if (devMode){
                                console.log("[MASKED] devMode on")
                                templateFunctions.showLog()
                            } else {
                                console.log("[MASKED] devMode off")
                                templateFunctions.hideLog()
                            }
                        }}/>
                    </section>
                    : null
                }
                {(url === "/highscores") ?
                    <section className={style.section + " " + style.highScores} id={"highscores"}>
                        <Game highScores={true} />
                    </section>
                    : null
                }
                {(url !== "/about" && url !== "/highscores") ?
                    <section className={style.section + " " + style.home} id={"home"}>
                        <Game
                              effect={function (current) {
                                  gameFunctions.backToTheStart = current.backToTheStart;
                              }}
                              onStart={onStart}
                              onBackToTheStart={onBackToTheStart}
                        />
                    </section> :
                    null
                }
            </div>
        </Template>
    );
}
