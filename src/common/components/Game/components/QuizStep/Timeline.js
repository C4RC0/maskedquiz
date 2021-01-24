import React, {useState, useEffect} from "react";
import style from "./quizstep.css";

export default function Timeline(props) {

    const {effect, duration} = props;
    const [state, setState] = useState("stop");

    useEffect(function () {
        if (effect) {
            effect({
                setState: function (value) {
                    setState(value)
                }
            })
        }
    })

    let className =
        (state === "start") ?
            style.timeline_start : (state === "stop") ?
            style.timeline_stop : "";

    if (state === "paused"){
        className = style.timeline_start + " " + style.timeline_paused;
    }

    if (state === "resume"){
        className = style.timeline_start + " " + style.timeline_paused + " " + style.timeline_resume;
    }

    return (
        <div
            className={style.timeline + " " + className}
            style={{animationDuration: duration + "ms"}}
        />
    )

}
