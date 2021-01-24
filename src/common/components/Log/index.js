import React, { useEffect, useState, useContext } from "react";
import {WappContext} from "wapplr-react/dist/common/Wapp";
import {storage} from "../Game/utils";
import style from "./log.css";

function setConsole(log) {
    if (!console.tempLog){

        Object.defineProperty(console, "tempLog", {
            enumerable: false,
            writable: false,
            configurable: false,
            value: console.log
        })

    }

    console.log = function (){
        const devMode = storage().devMode;
        if (log && devMode) {
            log(...arguments);
        }
        return console.tempLog(...arguments)
    }
}

export default function Log(props) {

    const context = useContext(WappContext);
    const {wapp} = context;

    const {effect} = props;

    const [logs, setLogs] = useState([]);
    const [visibility, setVisibility] = useState(true);

    function add(message) {
        setLogs([
            ...logs,
            message
        ]);
    }

    function clear() {
        setLogs([]);
    }

    function show() {
        setVisibility(true);
    }

    function hide() {
        setVisibility(false);
    }

    let element = null;

    wapp.styles.use(style);

    useEffect(function () {
        setConsole(function (...attributes) {
            add(attributes.join(" "));
        });
        if (effect){
            effect({
                clear,
                show,
                hide
            })
        }
        if (element){
            element.scrollTop = element.scrollHeight;
        }
    })

    return (logs && logs.length && visibility) ?
        <div
            className={style.logContainer}
            ref={
                function setRef(e){
                    element = e;
                }
            }
        >
            {
                logs.map(function (log, i){
                    return (
                        <div key={i} className={style.logRow}>{log}</div>
                    )
                })
            }
        </div>
        :
        null
}
