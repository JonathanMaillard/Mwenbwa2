import * as React from "react";
import {showGamelogModal, showLeaderboardModal} from "../display/show-modal";

const Button = () => (
    <div className={"containerButton"}>
        <div className={"boxButton"}>
            <button
                type={"button"}
                className={"boxButton--Gamelog"}
                onClick={showGamelogModal}>
                {"Gamelog"}
            </button>
            <button
                type={"button"}
                className={"boxButton--LeaderBoard"}
                onClick={showLeaderboardModal}>
                {"LeaderBoard"}
            </button>
        </div>
    </div>
);

export default Button;
