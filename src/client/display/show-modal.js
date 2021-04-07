import * as React from "react";
import ReactDOM from "react-dom";
const axios = require("axios");

import Gamelog from "../components/gamelog";
import Leaderboard from "../components/leaderboard";

function showGamelogModal() {
    document.querySelector("#gamelog").classList.add("show-modal");
    axios
        .get(`/logs`)
        .then(response => {
            ReactDOM.render(
                <Gamelog logs={response.data.slice(0, 5)} />,
                document.querySelector("#gamelog"),
            );
        })
        .catch(e => {
            console.log("sad because :", e);
        });
}
function showLeaderboardModal() {
    document.querySelector("#leaderboard").classList.add("show-modal");
    axios
        .get(`/leaderboard`)
        .then(response => {
            ReactDOM.render(
                <Leaderboard leaderboard={response.data.slice(0, 9)} />,
                document.querySelector("#leaderboard"),
            );
        })
        .catch(e => {
            console.log("sad because :", e);
        });
}
function showRulesModal() {
    document.querySelector(".rules").classList.add("show-modal");
}
function showDisconnectModal() {
    document.querySelector(".disconnect").classList.add("show-modal");
}
function showDashboardModal() {
    document.querySelector("#dashboard").classList.add("show-modal");
}
function showConnectModal() {
    document.querySelector(".sign").classList.add("show-modal");
}
function toggleProfile() {
    document
        .querySelector(".containerProfile")
        .classList.toggle("show-profile");
}

export {showGamelogModal};
export {showLeaderboardModal};
export {showRulesModal};
export {showDisconnectModal};
export {showDashboardModal};
export {showConnectModal};
export {toggleProfile};
