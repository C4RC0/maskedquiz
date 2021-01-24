import React, { useEffect, useState } from "react";

import defaultQuizData from "../../../../data/quizdata";
import {getContainScale, shuffleArray, storage} from "../../utils";

import Timeline from "./Timeline";
import WrongIcon from "./WrongIcon";
import RightIcon from "./RightIcon";

import templateStyle from "../../../Template/template.css";
import gameStyle from "../../game.css";
import style from "./quizstep.css";

let stepStartTime = 0;
let stepTimeTimeout = null;
let stepDuration = 0;
let stepElapsedTime = 0;

export default function QuizStep(props) {

    const {
        answers = defaultQuizData[0].answers,
        image = defaultQuizData[0].image,
        imageWidth = defaultQuizData[0].imageWidth,
        imageHeight = defaultQuizData[0].imageHeight,
        mask = defaultQuizData[0].mask,
        maskWidth = defaultQuizData[0].maskWidth,
        maskHeight = defaultQuizData[0].maskHeight,
        maskX = defaultQuizData[0].maskX,
        maskY = defaultQuizData[0].maskY,
        maskR = defaultQuizData[0].maskR,
        maskS = defaultQuizData[0].maskS,
        onEnd,
        wapp
    } = props;

    const defaultGameStatus = props.gameStatus || "game";
    const defaultStepDuration = props.stepDuration;

    wapp.styles.use(style);

    const [gameStatus, setStatus] = useState(defaultGameStatus);
    const [shuffledAnswers, setShuffledAnswers] = useState( answers );
    const [rightAnswer, setRightAnswer] = useState(false);
    const [answer, setAnswer] = useState("");

    let setTimelineState = null;
    let imageContainer = null;
    let scaleContainer = null;
    let maskContainer = null;
    let scale = 1;

    const rightValue = answers[0];

    stepDuration = defaultStepDuration || stepDuration || 10000;

    function setDimensions() {

        if (!imageContainer || !scaleContainer || !maskContainer) {
            return;
        }

        scale = getContainScale({
            containerWidth: imageContainer.offsetWidth,
            containerHeight: imageContainer.offsetHeight,
            imageWidth,
            imageHeight
        })

        scaleContainer.style.transform = "scale("+scale+")";
        scaleContainer.style["-webkit-transform"] = "scale("+scale+")";
        scaleContainer.style["-moz-transform"] = "scale("+scale+")";
        scaleContainer.style["-ms-transform"] = "scale("+scale+")";
        scaleContainer.style["-o-transform"] = "scale("+scale+")";

        scaleContainer.style.top = ((imageContainer.offsetHeight - (imageHeight*scale)) / 2) + "px";
        scaleContainer.style.left = ((imageContainer.offsetWidth - (imageWidth*scale)) / 2) + "px";

        maskContainer.style.transform = "translate(-50%,-50%) rotate("+maskR+"deg)";
        maskContainer.style["-webkit-transform"] = "translate(-50%,-50%) rotate("+maskR+"deg)";
        maskContainer.style["-moz-transform"] = "translate(-50%,-50%) rotate("+maskR+"deg)";
        maskContainer.style["-ms-transform"] = "translate(-50%,-50%) rotate("+maskR+"deg)";
        maskContainer.style["-o-transform"] = "translate(-50%,-50%) rotate("+maskR+"deg)";

        maskContainer.style.top = maskY + "px";
        maskContainer.style.left = maskX + "px";

        maskContainer.children[0].style.transform = "scale("+maskS+")";
        maskContainer.children[0].style["-webkit-transform"] = "scale("+maskS+")";
        maskContainer.children[0].style["-moz-transform"] = "scale("+maskS+")";
        maskContainer.children[0].style["-ms-transform"] = "scale("+maskS+")";
        maskContainer.children[0].style["-o-transform"] = "scale("+maskS+")";

    }

    function startTime() {
        if (!stepTimeTimeout) {
            if (!stepElapsedTime) {
                stopTime();
                stepStartTime = Date.now();
                setTimelineState("start");
            } else {
                stepStartTime = Date.now() - stepElapsedTime;
                setTimelineState("resume");
            }
            stepTimeTimeout = setTimeout(function () {
                stopTime();
                onClick(null, null);
            }, stepDuration - stepElapsedTime)
        }
    }

    function stopTime() {
        if (stepTimeTimeout){
            clearTimeout(stepTimeTimeout);
            stepTimeTimeout = null;
            stepStartTime = 0;
            stepElapsedTime = 0;
            setTimelineState("stop");
        }
    }

    function pauseTime() {
        clearTimeout(stepTimeTimeout);
        stepElapsedTime = Date.now() - stepStartTime;
        stepTimeTimeout = null;
        setTimelineState("paused");
    }

    function resumeTime() {
        startTime();
    }

    function onClick(e, value) {
        stopTime();
        if (e) {
            e.preventDefault();
        }
        if (gameStatus === "game") {

            setAnswer(value);
            if (rightValue === value && value) {
                setRightAnswer(true)
            } else {
                setRightAnswer(false)
            }

            setStatus("solution");

            if (onEnd){
                onEnd({
                    answer: value,
                    rightAnswer: (rightValue === value && value),
                    shuffledAnswers,
                    gameStatus: "solution"
                });
            }

        }
    }

    useEffect(function () {
        const newAnswers = [...answers];
        if (!storage().devMode) {
            shuffleArray(newAnswers);
        }
        setShuffledAnswers(newAnswers)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(function () {
        setDimensions();
        window.addEventListener("resize", setDimensions)
        window.addEventListener("blur", pauseTime);
        window.addEventListener("focus", resumeTime);
        if (gameStatus === "game"){
            startTime();
        }
        return function () {
            stopTime();
            window.removeEventListener("resize", setDimensions)
            window.removeEventListener("blur", pauseTime);
            window.removeEventListener("focus", resumeTime);
        }
    })

    return (
        <div className={style.quizStep}>
            <Timeline duration={stepDuration}
                      effect={function (current){
                          setTimelineState = current.setState;
                      }}
            />
            <div
                className={style.imageContainer}
                style={{backgroundImage:"url("+image+")"}}
                ref={function (e){imageContainer = e;}}>
                <img
                    src={image}
                    width={imageWidth}
                    height={imageHeight}
                    alt={"quiz"}
                />
                <div className={style.scaleContainer}
                     style={{
                         width:imageWidth + "px",
                         height: imageHeight + "px"
                     }}
                     ref={function (e){scaleContainer = e;}}>
                    <div
                        className={
                            (gameStatus === "solution") ?
                                style.maskContainer + " " + style.end :
                                style.maskContainer
                        }
                        style={{
                            width: maskWidth,
                            height: maskHeight,
                            left: maskX+"px",
                            top: maskY+"px",
                            transform: "rotate("+maskR+"deg)",
                            WebkitTransform: "rotate("+maskR+"deg)",
                            MozTransform: "rotate("+maskR+"deg)",
                            MsTransform: "rotate("+maskR+"deg)",
                            OTransform: "rotate("+maskR+"deg)",
                        }}
                        ref={function (e){maskContainer = e;}}
                    >
                        <div
                            style={{
                                backgroundImage:"url("+mask+")",
                                transform: "scale("+maskS+")",
                                WebkitTransform: "scale("+maskS+")",
                                MozTransform: "scale("+maskS+")",
                                MsTransform: "scale("+maskS+")",
                                OTransform: "scale("+maskS+")",
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className={style.buttons} >
                {shuffledAnswers.map(function (value, i){

                    let buttonStyle = templateStyle.button + " " + gameStyle.gameButton;

                    if (gameStatus === "solution"){
                        buttonStyle = buttonStyle + " " + style.disabled;
                        if (value === rightValue){
                            buttonStyle = buttonStyle + " " + style.rightValue
                        }
                        if (value === answer){
                            buttonStyle = buttonStyle + " " + style.selected
                        }
                    }

                    return (
                        <div key={i}>
                            {(value === answer && gameStatus === "solution") ?
                                (rightAnswer) ? <RightIcon /> : <WrongIcon />
                                : null
                            }
                            <div
                                className={buttonStyle}
                                onClick={function (e) {
                                    return onClick(e, value);
                                }}
                            >
                                {value}
                            </div>
                        </div>
                    )

                })}
            </div>
        </div>
    )
}
