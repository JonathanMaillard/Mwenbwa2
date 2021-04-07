import * as React from "react";
import SignSVG from "../../ressources/images/undraw_nature.svg";
import {showSignIn, showSignUp} from "../display/show-sign-form";

const Sign = ({signUp, signIn, state}) => (
    <div className={state}>
        <div className={"sign__content"}>
            <div className={"sign__content__title"}>
                <button
                    className={"sign-up-btn sign-btn-checked"}
                    type={"button"}
                    onClick={showSignUp}>
                    {"Sign Up"}
                </button>
                <button
                    className={"sign-in-btn"}
                    type={"button"}
                    onClick={showSignIn}>
                    {"Sign In"}
                </button>
            </div>

            <div className={"sign-up sign-active"}>
                <img className={"sign-up__img"} src={SignSVG} alt={"Sign up"} />
                <div className={"sign-up__form"}>
                    {/* <label htmlFor={"userimg"} className={"sign-up__form__img"}>
                        {"Profile picture:"}
                        <div className={"preview"}>
                            <span className={"choose-txt"}>
                                {"Choose a file"}
                            </span>
                        </div>
                        <input
                            className={"file-input"}
                            type={"file"}
                            accept={"image/*"}
                            name={"userimg"}
                        />
                    </label> */}

                    <div className={"sign-up__form__name"}>
                        <label htmlFor={"usernameUp"} className={"label"}>
                            {"Username:"}
                        </label>
                        <input
                            type={"text"}
                            name={"usernameUp"}
                            id={"usernameUp"}
                        />
                    </div>

                    <div className={"sign-up__form__email"}>
                        <label htmlFor={"useremailUp"} className={"label"}>
                            {"Email adress:"}
                        </label>
                        <input
                            type={"email"}
                            name={"useremailUp"}
                            id={"userEmailUp"}
                        />
                    </div>

                    <div className={"sign-up__form__pwd"}>
                        <label htmlFor={"userpwdUp"} className={"label"}>
                            {"Password:"}
                        </label>
                        <input
                            type={"password"}
                            name={"userpwdUp"}
                            id={"userPwdUp"}
                        />
                    </div>

                    <div className={"sign-up__form__color"}>
                        <label htmlFor={"colortheme"} className={"label"}>
                            {"Color theme:"}
                        </label>
                    </div>

                    <button
                        className={"sign-up__form__btn"}
                        id={"signUpSubmit"}
                        type={"button"}
                        value={"Sign Up"}
                        onClick={signUp}>
                        {"Sign up"}
                    </button>

                    <div
                        className={"sign-up__error-holder"}
                        id={"signUpErrorHolder"}
                    />
                </div>
            </div>

            <div className={"sign-in"}>
                <img className={"sign-in__img"} src={SignSVG} alt={"Sign up"} />
                <div className={"sign-in__form"}>
                    <div className={"sign-in__form__name"}>
                        <label htmlFor={"userInfoIn"} className={"label"}>
                            {"Username:"}
                        </label>
                        <input
                            type={"text"}
                            name={"userInfoIn"}
                            id={"userInfoIn"}
                        />
                    </div>

                    <div className={"sign-in__form__pwd"}>
                        <label htmlFor={"userPwdIn"} className={"label"}>
                            {"Password:"}
                        </label>
                        <input
                            type={"password"}
                            name={"userPwdIn"}
                            id={"userPwdIn"}
                        />
                    </div>

                    <button
                        className={"sign-in__form__btn"}
                        id={"signInSubmit"}
                        type={"button"}
                        value={"Sign In"}
                        onClick={signIn}>
                        {"Sign In"}
                    </button>

                    <p
                        className={"sign-in__error-holder"}
                        id={"signInErrorHolder"}
                    />
                </div>
            </div>
        </div>
    </div>
);

export default Sign;
