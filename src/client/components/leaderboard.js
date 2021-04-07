import * as React from "react";
import LeaderboardSvg from "../../ressources/images/undraw_destination.svg";
import CloseSvg from "../../ressources/images/cancel.svg";
import {hideLeaderboardModal} from "../display/hide-modal";

const Leaderboard = ({leaderboard}) => (
    <div className={"leaderboard"}>
        <div className={"leaderboard__content"}>
            <p className={"leaderboard__content__title"}>{"Leaderboard"}</p>
            <div className={"leaderboard__content__subtitle"}>
                <p>{"Here are a top ten of the best players in the game."}</p>
            </div>
            <div className={"leaderboard-ranking"}>
                <img
                    src={LeaderboardSvg}
                    alt={"destination"}
                    className={"leaderboard-ranking__img"}
                />

                <ul className={"leaderboard-ranking__list"}>
                    <li className={"leaderboard-ranking__list__title"}>
                        <p className={"name"}>{"Player's Name"}</p>
                        <p className={"score"}>{"Score"}</p>
                    </li>
                    {leaderboard.map(user => (
                        <li
                            key={user.username}
                            className={"leaderboard-ranking__list__item"}>
                            <p className={"name"}>{user.username}</p>
                            <p className={"score"}>{user.score}</p>
                        </li>
                    ))}
                </ul>
            </div>

            <img //CLOSE BTN
                className={"close-btn"}
                src={CloseSvg}
                alt={"Close"}
                onClick={hideLeaderboardModal}
            />
        </div>
    </div>
);

export default Leaderboard;
