import React, { useState, useContext } from "react";
import {WappContext} from "wapplr-react/dist/common/Wapp";

import style from "./about.css";
import {storage} from "../Game/utils";

let clickedDev = 0;

export default function About(props) {

    const context = useContext(WappContext);
    const {wapp} = context;

    const [devMode, setDev] = useState(storage().devMode)
    const {devModeHandle} = props;

    wapp.styles.use(style);

    return (
        <div className={style.aboutContainer}>
            <div className={style.aboutSection}>
                <div className={style.aboutTitle}>
                    {"How to use"}
                </div>
                <div className={style.aboutText}>
                    {"1. Enter a username, that if you have enough score, you can be there to the high scores. The system automatically generates a funny name if you don't feel like typing your own." }
                </div>
                <div className={style.aboutText}>
                    {"2. Start the game. Guess who is under the mask. You have a few seconds to answer, so you need to hurry." }
                </div>
                <div className={style.aboutText}>
                    {"3. If you add a wrong answer or time runs out, you will lose a life. After three wrong answers, the game is over." }
                </div>
                <div className={style.aboutText}>
                    {"4. Then you can see the high scores, and your results. Here can you restart the game." }
                </div>
            </div>
            <div className={style.aboutSection}>
                <div
                    className={style.aboutTitle}
                    onClick={function (e){

                        if (clickedDev < 7) {
                            clickedDev = clickedDev + 1;

                            if (clickedDev === 7) {
                                storage({devMode: true})
                                setDev(true);

                                if (devModeHandle) {
                                    devModeHandle(true)
                                }
                            }
                        }

                    }}
                >
                    {"About development"}
                </div>
                <div className={style.aboutText}>
                    <span>
                        {"It was created just for fun. If you want your company to have a game like this contact me: "}
                    </span>
                    <span>
                        <a href={"https://github.com/c4rc0"} target={"_blank"} rel={"noreferrer"}>
                            {"C4RC0"}
                        </a>
                    </span>
                </div>
                {(devMode) ?
                    <div className={style.aboutText}
                         onClick={function (e){

                             clickedDev = 0;
                             storage({devMode: false});
                             setDev(false);

                             if (devModeHandle) {
                                 devModeHandle(false);
                             }

                         }}
                    >
                        {"You in are developer mode"}
                    </div>
                    :
                    null
                }
            </div>
        </div>
    )
}
