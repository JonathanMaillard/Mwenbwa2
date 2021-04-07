/* becodeorg/mwenbwa
 *
 * /src/client/app.js - Client entry point
 *
 * coded by leny@BeCode
 * started at 18/05/2020
 */

import React from "react";
import ReactDOM from "react-dom";
import "./../style.scss";
const axios = require("axios");

import Map from "./components/map";
import Sign from "./components/sign";
import Rules from "./components/rules";
import Disconnect from "./components/disconnect";
import Profile from "./components/profile";
import Button from "./components/button";
import Dashboard from "./components/dashboard";
import {hideSignForm} from "./display/hide-sign-form";
import {showConnectModal, toggleProfile} from "./display/show-modal";
import {hideDisconnectModal} from "./display/hide-modal";

const defaultUser = {
    userId: 0,
    username: "guest",
    userEmail: "guest@BertrandleBG.com",
    userColor: "#F94144",
    userScore: 3,
    userTrees: [],
};

const addColorEvents = () => {
    const colorButtons = [...document.querySelectorAll(".circle-picker>span")];
    colorButtons.forEach((button, i) => {
        button.addEventListener("click", () => {
            document.querySelector("body").className = `theme${i + 1}`;
            document.cookie = `color=theme${i + 1}; expires=${new Date(
                new Date().getTime() + 1000 * 60 * 60 * 24 * 3,
            ).toGMTString()}`;
        });
    });
};
const getSessionStorage = () => ({
    userId: sessionStorage.getItem("userId"),
    username: sessionStorage.getItem("username"),
    userEmail: sessionStorage.getItem("userEmail"),
    userColor: sessionStorage.getItem("userColor"),
    userScore: sessionStorage.getItem("userScore"),
    userTrees: sessionStorage.getItem("userTrees").split(","),
});
const setSessionStorage = newSession => {
    sessionStorage.setItem("userId", newSession.userId);
    sessionStorage.setItem("username", newSession.username);
    sessionStorage.setItem("userEmail", newSession.userEmail);
    sessionStorage.setItem("userColor", newSession.userColor);
    sessionStorage.setItem("userScore", newSession.userScore);
    sessionStorage.setItem("userTrees", newSession.userTrees.join(","));
};
setSessionStorage(defaultUser);

const App = () => {
    const changeNameValidation = () => {
        axios
            .post("/changeUsername", {
                userId: sessionStorage.getItem("userId"),
                username: document.querySelector("#usernameInput").value,
            })
            .then(result => {
                document.querySelector(".dashInput").disabled = true;
                document
                    .querySelector(".dashInput")
                    .classList.remove("inputNameBorder");
                document
                    .querySelector(".dashInputBtn")
                    .classList.remove("dashInputBtnClick");
                document.querySelector(".dashInput").placeholder =
                    result.username;
            });
    };
    const signUp = () => {
        const username = document.querySelector("#usernameUp").value;
        const userEmail = document.querySelector("#userEmailUp").value;
        const userPwd = document.querySelector("#userPwdUp").value;
        axios
            .post("/register", {
                username,
                userEmail,
                userPwd,
            })
            .then(result => {
                document.cookie = `userId=${
                    result.data.content._id
                }; expires=${new Date(
                    new Date().getTime() + 1000 * 60 * 60 * 24 * 3,
                ).toGMTString()}; SameSite=None; Secure`;
                const newSession = {
                    userId: result.data.content._id,
                    username: result.data.content.username,
                    userEmail: result.data.content.email,
                    userColor: result.data.content.color,
                    userScore: result.data.content.score,
                    userTrees: result.data.content.trees || [],
                };
                setSessionStorage(newSession);
                hideSignForm();
                ReactDOM.render(
                    <Profile user={newSession} />,
                    document.querySelector("#profile"),
                );
                ReactDOM.render(
                    <Dashboard
                        user={newSession}
                        changeNameValidation={changeNameValidation}
                    />,
                    document.querySelector("#dashboard"),
                );
                addColorEvents();
            })
            .catch(error => {
                let displayMessage;
                switch (error.msg) {
                    case "invalidPwd":
                        displayMessage = "The password is incorrect.";
                        break;
                    case "invalidInfo":
                        displayMessage = "The username chosen already exists.";
                        break;
                    case "error":
                    default:
                        displayMessage =
                            "There was an unexpected error with the registering. Please try again.";
                        break;
                }
                document.querySelector(
                    "#signUpErrorHolder",
                ).innerText = displayMessage;
            });
    };
    const signIn = () => {
        const userInfo = document.querySelector("#userInfoIn").value;
        const userPwd = document.querySelector("#userPwdIn").value;
        axios
            .post("/login", {
                userInfo,
                userPwd,
            })
            .then(result => {
                document.cookie = `userId=${
                    result.data.content._id
                }; expires=${new Date(
                    new Date().getTime() + 1000 * 60 * 60 * 24 * 3,
                ).toGMTString()}; SameSite=None; Secure`;
                const newSession = {
                    userId: result.data.content._id,
                    username: result.data.content.username,
                    userEmail: result.data.content.email,
                    userColor: result.data.content.color,
                    userScore: result.data.content.score,
                    userTrees: result.data.content.trees || [],
                };
                setSessionStorage(newSession);
                hideSignForm();
                ReactDOM.render(
                    <Profile user={newSession} />,
                    document.querySelector("#profile"),
                );
                ReactDOM.render(
                    <Dashboard
                        user={newSession}
                        changeNameValidation={changeNameValidation}
                    />,
                    document.querySelector("#dashboard"),
                );
                addColorEvents();
            })
            .catch(error => {
                let displayMessage;
                switch (error.msg) {
                    case "invalidPwd":
                        displayMessage = "The password is incorrect.";
                        break;
                    case "invalidInfo":
                        displayMessage = "Your username is incorrect.";
                        break;
                    case "error":
                    default:
                        displayMessage =
                            "There was an error while trying to connect.";
                        break;
                }
                document.querySelector(
                    "#signInErrorHolder",
                ).innerText = displayMessage;
            });
    };
    const logout = () => {
        document.cookie = "userId= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        setSessionStorage(defaultUser);
        hideDisconnectModal();
        showConnectModal();
        toggleProfile();
    };

    const cookieSessionId =
        document.cookie &&
        document.cookie.split(";").find(x => x.trim().startsWith("userId"))
            ? document.cookie
                  .split(";")
                  .find(x => x.trim().startsWith("userId"))
                  .split("=")[1]
                  .trim()
            : 0;
    cookieSessionId &&
        axios.get(`/user/${cookieSessionId}`).then(result => {
            console.log("VOICI LE RESULTAT : ", result);
            document.cookie = `userId=${result.data[0]._id}; expires=${new Date(
                new Date().getTime() + 1000 * 60 * 60 * 24 * 3,
            ).toGMTString()}; SameSite=None; Secure`;
            const startSession = {
                userId: result.data[0]._id,
                username: result.data[0].username,
                userEmail: result.data[0].email,
                userColor: result.data[0].color,
                userScore: result.data[0].score,
                userTrees: result.data[0].trees || [],
            };
            setSessionStorage(startSession);
            ReactDOM.render(
                <Profile user={startSession} />,
                document.querySelector("#profile"),
            );
            ReactDOM.render(
                <Dashboard
                    user={startSession}
                    changeNameValidation={changeNameValidation}
                />,
                document.querySelector("#dashboard"),
            );
            addColorEvents();
        });

    return (
        <div id={"container"}>
            <div id={"mapid"}>
                <Map trees={[]} />
            </div>

            <Button />

            <div id={"profile"}>
                <Profile user={getSessionStorage()} />
            </div>

            <div id={"leaderboard"} />
            <div id={"gamelog"} />
            <Sign
                signUp={signUp}
                signIn={signIn}
                state={cookieSessionId ? "sign" : "sign show-modal"}
            />
            <Rules />
            <Disconnect logout={logout} />
            <div id={"dashboard"}>
                <Dashboard
                    user={getSessionStorage()}
                    changeNameValidation={changeNameValidation}
                />
            </div>
        </div>
    );
};

ReactDOM.render(<App />, document.querySelector("#root"));

axios
    .get("/trees")
    .then(response => {
        ReactDOM.render(
            <Map trees={response.data} />,
            document.querySelector("#mapid"),
        );
    })
    .catch(e => {
        console.log("sad because :", e);
    });

const cookieColor =
    document.cookie &&
    document.cookie.split(";").find(x => x.trim().startsWith("color"))
        ? document.cookie
              .split(";")
              .find(x => x.trim().startsWith("color"))
              .split("=")[1]
              .trim()
        : "";
document.querySelector("body").className = cookieColor ? cookieColor : "";

addColorEvents();
