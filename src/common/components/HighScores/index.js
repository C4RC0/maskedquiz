import React, {useEffect, useState, useContext} from "react";
import {WappContext} from "wapplr-react/dist/common/Wapp";

import {storage} from "../Game/utils";

import templateStyle from "../Template/template.css";
import style from "./highscores.css";
import gameStyle from "../Game/game.css";

let globalHighScores = [];

export default function HighScores(props) {

    const {wapp} = useContext(WappContext)
    const send = wapp.requests.send;

    wapp.styles.use(style);

    const {score, elapsedTime, onBackToTheStart} = props;

    // eslint-disable-next-line no-unused-vars
    const [fetched, setFetched] = useState(false)

    useEffect(function () {

        async function getGlobalHighScores(callback) {
            let requestName = (storage().devMode) ? wapp.globals.WAPP : "getBrief";
            requestName = "highScore" + requestName.slice(0,1).toUpperCase() + requestName.slice(1);

            const response = await send({requestName, args: {}});

            globalHighScores = (response && response[requestName]) ? response[requestName] : [];

            callback();

            return globalHighScores;
        }

        getGlobalHighScores(function () {
            setFetched(true)
        })

    }, [send])

    const yourHighScores = storage().highScores;

    return (
        <div className={style.highScores}>

            {(score || elapsedTime) ?
                <div className={style.highScoresYourScoreTitle}>
                    {"YOUR SCORE AND TIME"}
                </div>
                : null
            }
            {(score || elapsedTime) ?
                <div className={style.highScoresYourScore}>
                    {score + " points | " + Math.round(elapsedTime / 1000) + " sec"}
                </div>
                : null
            }
            {(globalHighScores && globalHighScores.length) ?
                <div className={style.highScoresTitle}>
                    {"HIGH SCORES"}
                </div>
                : null
            }
            {(globalHighScores && globalHighScores.length) ?
                <div className={style.highScoresTable}>
                    {[...globalHighScores.map(function (hs, i){
                        return (
                            <div key={i}
                                 className={style.highScoresRow}
                            >
                                <span className={style.hsRank}>
                                    {(i+1) + "."}
                                </span>
                                <span className={style.hsUser}>
                                    {hs.username}
                                </span>
                                <span className={style.hsScore}>
                                    {hs.score + " points"}
                                </span>
                                {(hs.time) ?
                                    <span className={style.hsScore}>
                                        {Math.round(hs.time/1000) + " sec"}
                                    </span>
                                    : null
                                }
                            </div>
                        )
                    })]}
                </div>
                :
                null
            }
            {(yourHighScores && yourHighScores.length) ?
                <div className={style.highScoresTitle}>YOUR HIGH SCORES</div>
                : null
            }
            {(yourHighScores && yourHighScores.length) ?
                <div className={style.highScoresTable}>
                    {[...yourHighScores.slice(0,3).map(function (hs, i) {
                        return (
                            <div key={i}
                                 className={style.highScoresRow}
                            >
                                <span className={style.hsRank}>
                                    {(i + 1) + "."}
                                </span>
                                <span className={style.hsUser}>
                                    {hs.username}
                                </span>
                                <span className={style.hsScore}>
                                    {hs.score + " points"}
                                </span>
                                {(hs.time) ?
                                    <span className={style.hsScore}>
                                        {Math.round(hs.time / 1000) + " sec"}
                                    </span>
                                    : null
                                }
                            </div>
                        )
                    })]}
                </div>
                :
                null
            }
            <div className={style.backToTheHome}>
                <button
                    onClick={
                        function (e){
                            e.preventDefault();
                            if (onBackToTheStart) {
                                onBackToTheStart(e);
                            }
                        }
                    }
                    className={templateStyle.button + " " + gameStyle.gameButton}
                >
                    {"BACK TO THE START"}
                </button>
            </div>
        </div>
    )
}
