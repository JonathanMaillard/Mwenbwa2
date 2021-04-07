/* becodeorg/mwenbwa
 *
 * /src/server/index.js - Server entry point
 *
 * coded by leny@BeCode & smaragdenteam
 * started at 18/05/2020
 */

// EXPRESS DECLARATION
import express from "express";
import path from "path";
import bodyParser from "body-parser";
//const {APP_PORT} = process.env;
const app = express();
app.use(express.static(path.resolve(__dirname, "../../bin/client")));
const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded({extended: false});

// BCRYPT DECLARATION
const bcrypt = require("bcryptjs");
const saltRounds = 10;

//Importer fichier dbCalls
import {
    dbGetTrees,
    dbGetTree,
    dbGetUser,
    dbGetLeaderboard,
    dbGetLogs,
    dbGetUserFromInfo,
    dbRegister,
    dbBuyTree,
    dbLockTree,
    dbAddComment,
    dbChangeColor,
    dbModifyMail,
    dbModifyUsername,
    dbModifyPassword,
    dbModifyPics,
    dbAddLog,
    dbUpdate,
} from "./db-calls";

//Add leafs every 15 minutes to every player
setInterval(() => {
    dbUpdate();
}, 1000 * 60 * 15);

// GET REQUESTS
app.get("/trees", async (req, res) => {
    const request = await dbGetTrees();
    res.send(request);
});
app.get("/tree/:treeid", async (req, res) => {
    const treeId = req.params.treeid;
    const request = await dbGetTree(treeId);
    res.send(request);
});
app.get("/user/:userid", async (req, res) => {
    const userId = req.params.userid;
    const request = await dbGetUser(userId);
    res.send(request);
});
app.get("/leaderboard", async (req, res) => {
    const request = await dbGetLeaderboard();
    res.send(request);
});
app.get("/logs", async (req, res) => {
    const request = await dbGetLogs();
    res.send(request);
});

// CONNEXION
app.post("/login", jsonParser, async (req, res) => {
    const userInfo = req.body.userInfo;
    const pwd = req.body.userPwd;
    try {
        const request = await dbGetUserFromInfo(userInfo);
        if (request) {
            bcrypt.compare(pwd, request[0].password, (err, result) => {
                res.status(result ? 200 : 400).send(
                    result
                        ? {
                              msg: "correct",
                              content: request[0],
                          }
                        : {
                              msg: "invalidPwd",
                              content: {},
                          },
                );
            });
        } else {
            res.status(400).send({
                msg: "invalidInfo",
                content: {},
            });
        }
    } catch (e) {
        console.log(e);
        res.status(400).send({
            msg: "error",
            content: {},
        });
    }
});
app.post("/register", jsonParser, (req, res) => {
    const username = req.body.username;
    const userEmail = req.body.userEmail;
    const userPwd = req.body.userPwd;
    const userColor = req.body.userColor || "#F94144";
    let request;
    try {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(userPwd, salt, async (error, hash) => {
                request = await dbRegister(
                    username,
                    hash,
                    userEmail,
                    userColor,
                );
                res.status(200).send({
                    msg: "correct",
                    content: request.ops[0],
                });
            });
        });
    } catch (e) {
        res.status(400).send({
            msg: "error",
            content: e,
        });
    }
});

app.post("/addLog", jsonParser, (req, res) => {
    const userId = req.body.userId;
    const content = req.body.content;
    const request = dbAddLog(content, userId);
    res.send(request);
});

// GAME ACTIONS COMMANDS
app.post("/buyTree", jsonParser, async (req, res) => {
    const userId = req.body.userId;
    const treeId = req.body.treeId;
    const treePrice = req.body.treePrice;
    const request = await dbBuyTree(treeId, userId, treePrice);
    res.status(200).send(request);
});
app.post("/lockTree", jsonParser, async (req, res) => {
    const userId = req.body.userId;
    const treeId = req.body.treeId;
    const treeLockPrice = req.body.treeLockPrice;
    const request = await dbLockTree(treeId, userId, treeLockPrice);
    res.status(200).send(request);
});
app.post("/comment", jsonParser, async (req, res) => {
    const userId = req.body.userId;
    const treeId = req.body.treeId;
    const comment = req.body.comment;
    const request = await dbAddComment(treeId, userId, comment);
    res.status(200).send(request);
});

// CHANGE SETTINGS COMMANDS
app.post("/changeColor", jsonParser, async (req, res) => {
    const userId = req.body.userId;
    const color = req.body.color;
    const request = await dbChangeColor(userId, color);
    res.status(200).send(request);
});
app.post("/changeEmail", jsonParser, async (req, res) => {
    const userId = req.body.userId;
    const userEmail = req.body.userEmail;
    const request = await dbModifyMail(userId, userEmail);
    res.status(200).send(request);
});
app.post("/changeUsername", jsonParser, async (req, res) => {
    const userId = req.body.userId;
    const username = req.body.username;
    const request = await dbModifyUsername(userId, username);
    res.status(200).send(request);
});
app.post("/changePwd", jsonParser, async (req, res) => {
    const userId = req.body.userId;
    const newPwd = req.body.newPwd;
    const oldPwd = req.body.oldPwd;
    try {
        const request = await dbGetUser(userId);
        if (request) {
            bcrypt.compare(oldPwd, request, (errComp, result) => {
                result &&
                    bcrypt.genSalt(saltRounds, (errSalt, salt) => {
                        bcrypt.hash(newPwd, salt, (errHash, hash) => {
                            result && dbModifyPassword(userId, hash);
                        });
                    });
                res.status(result ? 200 : 400).send(
                    result
                        ? {
                              msg: "correct",
                              content: request,
                          }
                        : {
                              msg: "invalidPwd",
                              content: {},
                          },
                );
            });
        } else {
            res.status(400).send({
                msg: "invalidInfo",
                content: {},
            });
        }
    } catch (e) {
        console.log(e);
        res.status(400).send({
            msg: "error",
            content: {},
        });
    }
});
app.post("/changePic", jsonParser, async (req, res) => {
    const userId = req.body.userId;
    const userPic = req.body.userPic;
    const request = await dbModifyPics(userId, userPic);
    res.status(200).send(request);
});

/*===================
SERVER LAUNCH
===================*/
// INITIATE DATABASE
// const axios = require("axios");
// const dataSetUrl =
//     "https://opendata.liege.be/explore/dataset/arbustum/download/?format=json&timezone=Europe/Berlin&lang=fr";
// axios
//     .get(dataSetUrl)
//     .then(response => {})
//     .catch(e => {
//         console.log("sad because :", e);
//     });

const server_port = process.env.PORT || 12345;

// START SERVER
app.listen(server_port, () =>
    console.log(`🚀 Server is listening on port ${server_port}.`),
);
