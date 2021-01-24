import React, {useState} from "react";

import {generateUsername, storage} from "../../utils";
import style from "../../game.css";
import templateStyle from "../../../Template/template.css";

export default function StartForm(props) {

    const {onSubmit} = props;
    const defaultUsername = props.username;

    const store = storage();
    const savedGames = store.savedGames || {};
    const thereAreSavedGames = Object.keys(savedGames).length;

    const [selectedGame, setSelectedGame] = useState((thereAreSavedGames) ? Object.keys(savedGames)[0] : "");
    const [username, setUsername] = useState(
        (selectedGame) ?
            savedGames[selectedGame].username : (defaultUsername) ?
            defaultUsername : generateUsername()
    );
    const [error, setError] = useState();

    function onFocus(e) {
        if (error && error.username){
            setError({username: null});
        }
    }

    function onBlur(e) {}

    function onChange(e) {
        const value = e.target.value;
        if (value !== username) {
            setUsername(value);
        }
        if (error && error.username){
            setError({username: null});
        }
    }

    function onChangeSaved(e) {
        const key = e.target.value;
        const game = savedGames[key];
        if (game) {
            setSelectedGame(key);
            if (game.username !== username) {
                setUsername(game.username);
            }
            if (error && error.username) {
                setError({username: null});
            }
        } else {
            setSelectedGame("");
        }
    }

    async function submit(e) {
        e.preventDefault();
        const store = storage();
        const savedGames = store.savedGames || {};
        if (onSubmit) {
            return onSubmit({
                data: {
                    username,
                    game: (selectedGame) ? savedGames[selectedGame] : null,
                    selectedGame
                },
                setError
            });
        }
    }

    const usernameLabel = (error && error && error.username) ? error.username : "Your nickname";

    return (
        <form id={"contactForm"} className={style.form} onSubmit={submit}>
            {(thereAreSavedGames) ?
                <div className={style.group}>
                    <select id={"savedGame"}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onChange={onChangeSaved}
                            value={(selectedGame) ? selectedGame : ""}
                    >
                        <option value={""} key={-1}>{"New game"}</option>
                        {Object.keys(savedGames).map(function (key, i) {
                            const game = savedGames[key];
                            return (
                                <option
                                    value={key} key={i}>
                                    {"Saved " + game.username + "'s game " + game.score + " points | " + Math.round(game.elapsedTime/1000) + " sec"}
                                </option>
                            )
                        })}
                    </select>
                    <span className={style.highlight}/>
                    <span className={style.bar}/>
                    <label className={(error && error.username) ? style.errorLabel : null}
                           htmlFor={"savedGame"}>{"Saved games"}
                    </label>
                </div>
                : null
            }
            <div className={style.group} >
                <input id={"usernameInput"}
                       type={"text"}
                       name={"username"}
                       onFocus={onFocus}
                       onBlur={onBlur}
                       onChange={onChange}
                       value={username}
                />
                <span className={style.highlight} />
                <span className={style.bar} />
                <label
                    className={(error && error.username) ? style.errorLabel : null}
                    htmlFor={"usernameInput"}>
                    {usernameLabel}
                </label>
            </div>
            <div>
                <button
                    className={templateStyle.button + " " + style.gameButton}>
                    {(selectedGame) ? "Resume Game!" : "Start Game!"}
                </button>
            </div>
        </form>
    )

}
