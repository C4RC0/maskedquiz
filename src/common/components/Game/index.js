import React, { useEffect, useState, useContext } from "react";
import {WappContext} from "wapplr-react/dist/common/Wapp";

import defaultQuizData from "../../data/quizdata";

import Logo from "../Logo";
import HighScores from "../HighScores";

import QuizStep from "./components/QuizStep";
import HeartIcon from "./components/HeartIcon";
import StartForm from "./components/StartForm";

import {generateUsername, storage, getDuration, shuffleArray} from "./utils";

import style from "./game.css";

let startTime = null;
let elapsedTime = null;
let quizData = null;
let onEndInterval = null;

export default function Game(props) {

    const {wapp, req, res} = useContext(WappContext);
    const {onStart, onBackToTheStart, effect, highScores} = props;

    wapp.styles.use(style);

    if (!quizData) {
        if (props.quizData) {
            quizData = [...props.quizData];
        }
        if (!quizData) {
            quizData = [...defaultQuizData];
        }
        if (!storage().devMode) {
            quizData = shuffleArray(quizData);
        }
    }

    const isBot = (
        req.wappRequest.userAgent.match("Chrome-Lighthouse") ||
        req.wappRequest.userAgent.match("Google Page Speed Insights")
    );

    const [step, setStep] = useState(0);
    const [lives, setLives] = useState(3);
    const [score, setScore] = useState(0);
    const [username, setUsername] = useState(props.userName || storage().username || generateUsername());

    function startFormSubmit({data = {}, setError}) {

        if (typeof data.username == "string" && data.username.length > 0 && data.username.length < 30) {
            let newStep = 1;
            let newLives = 3;
            let username = data.username;

            if (data.game) {

                elapsedTime = data.game.elapsedTime;
                startTime = Date.now() - elapsedTime;
                newStep = data.game.step + 1;
                quizData = (storage().devMode) ? quizData : (data.game.quizData) ? data.game.quizData : quizData;
                newLives = (typeof data.game.lives == "number") ? data.game.lives : lives;

                try {
                    const deleteKey = data.selectedGame || data.username;
                    if (deleteKey) {
                        removeGame({key: deleteKey})
                    }
                    saveGame({
                        ...data.game,
                        username,
                        key: username
                    })
                } catch (e) {}

                setScore(data.game.score);
            }

            storage({username});
            setLives(newLives)
            setUsername(username);
            setStep(newStep);

            if (onStart) {
                onStart();
            }

        } else {
            storage({username: null});
            setError({
                username: "Please specify a max 30 chars length nickname"
            })
        }
    }

    function saveGame(p = {}) {
        const savedGames = storage().savedGames || {};
        let key = p.key || username;
        if (key) {
            savedGames[key] = {
                username: p.username || username,
                elapsedTime: p.elapsedTime || elapsedTime,
                quizData: p.quizData || quizData,
                step: (typeof p.step !== "undefined") ? p.step : step,
                score: (typeof p.score !== "undefined") ? p.score : score,
                lives: (typeof p.lives !== "undefined") ? p.lives : lives,
            };
            storage({savedGames});
        }
    }

    function removeGame(p = {}) {
        const savedGames = storage().savedGames || {};
        let key = p.key || username;
        if (key && savedGames[key]) {
            delete savedGames[key];
            storage({savedGames});
        }
    }

    async function onEndStep({rightAnswer}) {

        let newScore = score;
        let newStep = step + 1;
        let newLives = lives;

        if (rightAnswer) {
            newScore = score + 1;
        } else {
            newLives = newLives - 1;
        }

        const now = Date.now();
        elapsedTime = now - startTime;

        if (!quizData[newStep - 1] || newLives < 1) {

            const store = storage();

            let localHighScores = store.highScores || [];

            const newHS = {
                username,
                score: newScore,
                step: step,
                time: elapsedTime,
                date: Date.now()
            };

            localHighScores.push(newHS)
            localHighScores = localHighScores.sort(function (a, b) {
                if (a.score === b.score) {
                    if (a.time && b.time) {
                        if (a.time > b.time) {
                            return 1;
                        } else {
                            return -1;
                        }
                    } else if (a.date > b.date) {
                        return -1;
                    } else {
                        return 1;
                    }
                } else if (a.score > b.score) {
                    return -1;
                } else {
                    return 1;
                }
            }).slice(0, 10);

            const savedGames = store.savedGames || {};
            if (typeof savedGames[username] !== "undefined") {
                delete savedGames[username];
            }

            removeGame();
            storage({highScores: localHighScores});
            await wapp.requests.send({
                req,
                res,
                requestName:"highScoreCreateOne",
                args:{
                    record:{...newHS}
                }
            });

        } else {
            saveGame({elapsedTime, score: newScore, step, lives: newLives});
        }

        onEndInterval = setTimeout(function (){
            if (rightAnswer) {
                setScore(newScore)
            } else {
                setLives(newLives)
            }
            setStep(newStep);
        },1000)
    }

    function backToTheStart(e) {

        startTime = null;
        elapsedTime = null;
        quizData = null;
        quizData = null;
        clearInterval(onEndInterval);
        onEndInterval = null;

        setScore(0);
        setStep(0);
        setLives( 3);

        if (onBackToTheStart) {
            onBackToTheStart(e);
        }
    }

    useEffect(function () {

        function backToTheStart(e) {
            startTime = null;
            elapsedTime = null;
            quizData = null;
            quizData = null;
            clearInterval(onEndInterval);
            onEndInterval = null;

            setScore(0);
            setStep(0);
            setLives( 3);
        }

        if (step === 1) {
            startTime = Date.now();
        }

        if (effect) {
            effect({backToTheStart})
        }

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        })

        return function () {
            clearInterval(onEndInterval)
            onEndInterval = null;
        }

    }, [step, effect, onBackToTheStart])

    return (
        <div className={style.game}>
            {(step === 0 && !highScores) ?
                <div className={style.startScreen}>
                    <div className={style.center}>
                        <div>
                            <div className={style.homeLogo}>
                                <Logo {...props} id={"homeLogo"} type={(isBot) ? "default" : "animation"} />
                            </div>
                            <div className={(isBot) ? style.homeFormWithoutAnim : style.homeForm}>
                                <StartForm onSubmit={startFormSubmit} username={username}/>
                            </div>
                        </div>
                    </div>
                </div> :
                null
            }
            {
                (quizData[step - 1] && !highScores && lives > 0) ?
                    <div className={style.score}>{"Score: " + score}</div>
                    : null
            }
            {
                (quizData[step - 1] && !highScores && lives > 0) ?
                    <div className={style.lives}>
                        {[...Array(lives).keys()].map(function (i){
                            return (
                                <div key={i} className={style.liveIcon}>
                                    <HeartIcon />
                                </div>
                            )
                        })}
                    </div>
                    : null
            }
            {
                (quizData[step - 1] && !highScores && lives > 0) ?
                    <QuizStep key={step - 1}
                              wapp={wapp}
                              {...quizData[step - 1]}
                              onEnd={onEndStep}
                              stepDuration={getDuration(step, quizData.length)}
                    />
                    : null
            }
            {
                ((step > 0 && !quizData[step - 1]) || highScores || lives < 1) ?
                    <HighScores
                        wapp={wapp}
                        score={(highScores) ? null : score}
                        elapsedTime={(highScores) ? null : elapsedTime}
                        onBackToTheStart={
                            (highScores) ?
                                function backToTheStart(e){
                                    e.preventDefault();
                                    wapp.client.history.push({
                                        search:"",
                                        href:"",
                                        pathname: "/"
                                    });
                                }
                                : backToTheStart
                        }
                    />
                    : null
            }
        </div>
    )
}
