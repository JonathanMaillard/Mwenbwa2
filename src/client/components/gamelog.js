import * as React from "react";
import GamelogSvg from "../../ressources/images/undraw_history.svg";
import CloseSvg from "../../ressources/images/cancel.svg";
import {hideGamelogModal} from "../display/hide-modal";

const Gamelog = ({logs}) => (
    <div className={"modal gamelog"}>
        <div className={"gamelog__content"}>
            <p className={"gamelog__content__title"}>{"Gamelog"}</p>
            <div className={"gamelog__content__subtitle"}>
                <p>{"Here are the last actions that happened in the game."}</p>
            </div>
            <div className={"gamelog-history"}>
                <img
                    src={GamelogSvg}
                    alt={"destination"}
                    className={"gamelog-history__img"}
                />
                <ul className={"gamelog-history__list"}>
                    {logs &&
                        logs.map(log => (
                            <li
                                key={log.username}
                                className={"gamelog-history__list__item"}>
                                <p>
                                    <span className={"italic"}>
                                        {log.username}{" "}
                                    </span>
                                    {log.content}
                                </p>
                            </li>
                        ))}
                </ul>
            </div>

            <img //CLOSE BTN
                className={"close-btn"}
                src={CloseSvg}
                alt={"Close"}
                onClick={hideGamelogModal}
            />
        </div>
    </div>
);

export default Gamelog;
