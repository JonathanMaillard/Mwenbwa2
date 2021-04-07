import React, {useState} from "react";
import {Popup} from "react-leaflet";
import OwnerSVG from "../../ressources/images/owner.svg";
import InfoSVG from "../../ressources/images/info.svg";
import CommentSVG from "../../ressources/images/comment.svg";
import LoadSVG from "../../ressources/trees-svg/svg/033-larch.svg";

const axios = require("axios");

const MyPopup = ({treeId}) => {
    const [dataLoaded, setDataLoaded] = useState(false);
    const [name, setName] = useState("");
    const [owner, setOwner] = useState("No one owns this tree yet !");
    const [price, setPrice] = useState(0);
    const [priceLock, setPriceLock] = useState(0);
    const [comment, setComment] = useState("No comment yet !");
    const [isLocked, setIsLocked] = useState(false);
    const [wiki, setWiki] = useState("");

    const handlePopupOpen = () => {
        axios
            .get(`/tree/${treeId}`)
            .then(response => {
                setDataLoaded(true);
                response.data.map(data => {
                    setName(data.nom_complet);

                    if (data.owner) {
                        setOwner(data.username);
                    }

                    const circonf = data.circonf;
                    const height = data.hauteur_totale;
                    const treePrice = Math.ceil(circonf * height);
                    setPrice(treePrice);
                    setPriceLock(treePrice * 10);

                    if (data.comment) {
                        setComment(data.comment);
                    }

                    if (data.locked) {
                        setIsLocked(true);
                    }

                    const treeNameArray = data.nom_complet.split(" ");
                    const treeName = treeNameArray.join("_");
                    setWiki(`https://en.wikipedia.org/wiki/${treeName}`);

                    return "done";
                });
            })
            .catch(e => {
                console.log("sad because :", e);
            });
    };

    const handlePopupClose = () => {
        setDataLoaded(false);
    };

    const BuyTree = () => {
        axios
            .post(`/buyTree`, {
                userId: sessionStorage.getItem("userId"),
                treeId,
                treePrice: price,
            })
            .then(response => {
                setOwner(sessionStorage.getItem("username"));
                console.log(response);
            })
            .catch(e => {
                console.log("sad because :", e);
            });

        const originalValueScore = sessionStorage.getItem("userScore");
        const newValueScore = originalValueScore - price;
        sessionStorage.setItem("userScore", newValueScore);
    };

    const LockTree = () => {
        axios
            .post(`/lockTree`, {
                userId: sessionStorage.getItem("userId"),
                treeId,
                treeLockPrice: priceLock,
            })
            .then(response => {
                setOwner(sessionStorage.getItem("username"));
                setIsLocked(true);
                console.log(response);
            })
            .catch(e => {
                console.log("sad because :", e);
            });

        const originalValueScore = sessionStorage.getItem("userScore");
        const newValueScore = originalValueScore - priceLock;
        sessionStorage.setItem("userScore", newValueScore);
    };

    return (
        <Popup onOpen={handlePopupOpen} onClose={handlePopupClose}>
            {!dataLoaded ? (
                <div className={"loader-animation"}>
                    <img src={LoadSVG} />
                </div>
            ) : (
                <div className={"popup"}>
                    <h3 className={"popup__name"}>{name}</h3>
                    <div className={"popup__owner"}>
                        <img
                            src={OwnerSVG}
                            alt={"owner"}
                            className={"popup__owner__img"}
                        />
                        {"Owner : "}
                        <span>{owner}</span>
                    </div>
                    <a
                        className={"popup__link"}
                        href={wiki}
                        target={"_blank"}
                        rel={"noreferrer"}>
                        <img
                            src={InfoSVG}
                            alt={"information"}
                            className={"popup__link__img"}
                        />
                        {"More info on this tree's species"}
                    </a>
                    <div className={"popup__comment"}>
                        <img
                            src={CommentSVG}
                            alt={"comment"}
                            className={"popup__comment__img"}
                        />
                        {"Comment : "}
                        <span>{comment}</span>
                    </div>
                    {(() => {
                        if (
                            sessionStorage.getItem("username") === owner &&
                            isLocked
                        ) {
                            return (
                                <p className={"popup__tree-yours"}>
                                    {
                                        "This tree is locked, but hey, it's yours..."
                                    }
                                </p>
                            );
                        } else if (isLocked) {
                            return (
                                <p className={"popup__locked"}>
                                    {"Bouuuuh, This tree is locked"}
                                </p>
                            );
                        } else if (
                            sessionStorage.getItem("username") === owner &&
                            sessionStorage.getItem("userScore") > priceLock
                        ) {
                            return (
                                <div className={"popup__button-container"}>
                                    <p className={"popup__tree-yours"}>
                                        {
                                            "Come on, This tree is already yours..."
                                        }
                                    </p>
                                    <button
                                        className={
                                            "popup__button-container__lock"
                                        }
                                        type={"button"}
                                        onClick={LockTree}>
                                        {"Lock for "}
                                        {priceLock}
                                        {" leaves"}
                                    </button>
                                </div>
                            );
                        } else if (
                            sessionStorage.getItem("username") === owner &&
                            sessionStorage.getItem("userScore") < priceLock
                        ) {
                            return (
                                <div className={"popup__button-container"}>
                                    <p className={"popup__tree-yours"}>
                                        {
                                            "Come on, This tree is already yours..."
                                        }
                                    </p>
                                    <p className={"popup__no-leaves"}>
                                        {
                                            "You don't have enough leaves to lock this tree! "
                                        }
                                        {priceLock}
                                        {" leaves"}
                                    </p>
                                </div>
                            );
                        } else if (
                            sessionStorage.getItem("userScore") < price
                        ) {
                            return (
                                <p className={"popup__no-leaves"}>
                                    {
                                        "You don't have enough leaves to buy or lock! "
                                    }
                                    {price}
                                    {" leaves"}
                                </p>
                            );
                        } else if (
                            sessionStorage.getItem("userScore") < priceLock
                        ) {
                            return (
                                <div className={"popup__button-container"}>
                                    <button
                                        className={
                                            "popup__button-container__buy"
                                        }
                                        type={"button"}
                                        onClick={BuyTree}>
                                        {"Buy for "}
                                        {price}
                                        {" leaves"}
                                    </button>
                                    <p className={"popup__no-leaves"}>
                                        {
                                            "You don't have enough leaves to lock! "
                                        }
                                        {priceLock}
                                        {" leaves"}
                                    </p>
                                </div>
                            );
                        }
                        return (
                            <div className={"popup__button-container"}>
                                <button
                                    className={"popup__button-container__buy"}
                                    type={"button"}
                                    onClick={BuyTree}>
                                    {"Buy for "}
                                    {price}
                                    {" leaves"}
                                </button>
                                <button
                                    className={"popup__button-container__lock"}
                                    type={"button"}
                                    onClick={LockTree}>
                                    {"Lock for "}
                                    {priceLock}
                                    {" leaves"}
                                </button>
                            </div>
                        );
                    })()}
                </div>
            )}
        </Popup>
    );
};

export default MyPopup;
