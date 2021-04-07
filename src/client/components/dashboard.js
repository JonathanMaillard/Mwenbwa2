import * as React from "react";
import CloseSvg from "../../ressources/images/cancel.svg";
import {hideDashboardModal} from "../display/hide-modal";
import CircleColor from ".././components/color-theme";

const md5 = require("md5");

function changeName() {
    document.querySelector(".dashInput").disabled = false;
    document.querySelector(".dashInput").classList.add("inputNameBorder");
    document.querySelector(".dashInputBtn").classList.add("dashInputBtnClick");
}

const dash = ({user, changeNameValidation}) => (
    <div className={"dashContainer"}>
        <div className={"dash__Box"}>
            <div className={"dash__BoxBtn"}>
                <img //CLOSE BTN
                    className={"dashBtn"}
                    src={CloseSvg}
                    alt={"Close"}
                    width={"40"}
                    onClick={hideDashboardModal}
                />
            </div>

            <div className={"dash__BoxContenu"}>
                <div className={"dash__BoxGauche"}>
                    <img
                        className={"dash__Photo"}
                        src={`http://www.gravatar.com/avatar/${md5(
                            "bastienlafalize@gmail.com",
                        )}?s=200`}
                    />
                </div>

                <div className={"dash__BoxDroite"}>
                    <div className={"dash__NameAndBtn"}>
                        <div className={"dash__InputAndBtn"}>
                            <input
                                className={"dashInput"}
                                disabled={"disabled"}
                                type={"text"}
                                placeholder={user.username}
                                id={"usernameInput"}
                            />
                            <button
                                type={"button"}
                                onClick={changeNameValidation}
                                className={"dashInputBtn"}>
                                <i className={"far fa-check-circle"} />
                            </button>
                        </div>
                        <button type={"button"} onClick={changeName}>
                            <i className={"far fa-edit"} />
                            <span>{"change name"}</span>
                        </button>
                    </div>

                    <div className={"dash__MailAndBtn"}>
                        <h2>{user.userEmail}</h2>
                    </div>
                    <form className={"dash__Radio"}>
                        <h2>{"Color Theme"}</h2>
                        <CircleColor />
                    </form>
                </div>
            </div>
        </div>
    </div>
);

export default dash;
