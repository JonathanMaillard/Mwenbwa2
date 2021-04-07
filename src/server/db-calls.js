//File for managing DB manipulation

// DATABASE CONNEXION
import {MongoClient, uri} from "./db-connexion";

const ObjectId = require("mongodb").ObjectId;

//GET

//Get all trees
const dbGetTrees = () => {
    const client = new MongoClient(uri, {useUnifiedTopology: true});

    async function run() {
        try {
            await client.connect();
            const database = client.db("mwenbwa");
            const collection = database.collection("trees");

            const query = {
                arbotag: {$nin: [null, 0]},
                circonf: {$nin: [null, 0]},
                hauteur_totale: {$nin: [null, 0]},
            };
            const options = {
                // Include only the arbotags and geoloc in each returned document
                projection: {
                    _id: 1,
                    arbotag: 1,
                    x_lambda: 1,
                    y_phi: 1,
                    owner: 1,
                    locked: 1,
                },
            };
            const cursor = await collection.find(query, options);
            const result = await cursor.toArray();

            return result.map(tree => ({
                type: "Feature",
                id: tree._id,
                properties: {
                    Color: tree.color,
                },
                geometry: {
                    type: "point",
                    coordinates: [tree.y_phi, tree.x_lambda],
                },
            }));
        } catch (err) {
            console.error(`Something went wrong: ${err}`);
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }

        return "done";
    }
    //run().catch(console.dir);
    return run();
};

//Get a specific tree
const dbGetTree = tree => {
    const client = new MongoClient(uri, {useUnifiedTopology: true});

    //console.log(tree);

    async function run() {
        try {
            await client.connect();
            const database = client.db("mwenbwa");
            const collection = database.collection("trees");

            const treeId = new ObjectId(tree);

            const query = {
                _id: treeId,
            };

            const cursor = await collection.find(query);
            const resultSearch = await cursor.toArray();

            if (resultSearch[0].owner) {
                const aggCursor = await collection.aggregate([
                    {
                        $match: {
                            _id: treeId,
                        },
                    },
                    {
                        $lookup: {
                            from: "players",
                            localField: "owner",
                            foreignField: "_id",
                            as: "data",
                        },
                    },
                    {
                        $unwind: "$data",
                    },
                    {
                        $project: {
                            _id: 1,
                            username: "$data.username",
                            nom_complet: 1,
                            hauteur_totale: 1,
                            circonf: 1,
                            owner: 1,
                            locked: 1,
                        },
                    },
                ]);

                const result = await aggCursor.toArray();
                console.log(result);
                return result;
            }

            return resultSearch;
        } catch (err) {
            console.error(`Something went wrong: ${err}`);
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }

        return "done";
    }
    //run().catch(console.dir);
    return run();
};

//Get a user
const dbGetUser = userId => {
    const client = new MongoClient(uri, {useUnifiedTopology: true});

    async function run() {
        try {
            await client.connect();
            const database = client.db("mwenbwa");
            const collection = database.collection("players");

            const o_userId = new ObjectId(userId);

            const query = {
                _id: o_userId,
            };

            const cursor = await collection.find(query);
            const result = await cursor.toArray();

            //console.log(result);
            return result;
        } catch (err) {
            console.error(`Something went wrong: ${err}`);
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }

        return "done";
    }
    //run().catch(console.dir);
    return run();
};

//Get a user
const dbGetUserFromInfo = userInfo => {
    const client = new MongoClient(uri, {useUnifiedTopology: true});

    async function run() {
        try {
            await client.connect();
            const database = client.db("mwenbwa");
            const collection = database.collection("players");

            const query = {
                username: userInfo,
            };

            const cursor = await collection.find(query);
            const result = await cursor.toArray();

            //console.log(result);
            return result;
        } catch (err) {
            console.error(`Something went wrong: ${err}`);
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }

        return "done";
    }
    //run().catch(console.dir);
    return run();
};

//Get the leaderboard
const dbGetLeaderboard = () => {
    const client = new MongoClient(uri, {useUnifiedTopology: true});

    async function run() {
        try {
            await client.connect();
            const database = client.db("mwenbwa");
            const collection = database.collection("players");

            const query = {};
            const options = {
                // sort returned documents in descending order by score
                sort: {score: -1},
                // Include only the username, color and score fields in each returned document
                projection: {_id: 0, username: 1, color: 1, score: 1},
            };
            const cursor = await collection.find(query, options);
            const result = await cursor.toArray();

            //console.log(result);
            return result;
        } catch (err) {
            console.error(`Something went wrong: ${err}`);
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }

        return "done";
    }
    //run().catch(console.dir);
    return run();
};

//Get the logs
const dbGetLogs = () => {
    const client = new MongoClient(uri, {useUnifiedTopology: true});

    async function run() {
        try {
            await client.connect();
            const database = client.db("mwenbwa");

            const aggCursor = await database.collection("logs").aggregate([
                {
                    $sort: {
                        _id: -1,
                    },
                },
                {
                    $lookup: {
                        from: "players",
                        localField: "authorId",
                        foreignField: "_id",
                        as: "data",
                    },
                },
                {
                    $unwind: "$data",
                },
                {
                    $project: {
                        _id: 0,
                        username: "$data.username",
                        content: 1,
                    },
                },
            ]);

            const result = await aggCursor.toArray();

            return result;
        } catch (err) {
            console.error(`Something went wrong: ${err}`);
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }

        return "done";
    }
    //run().catch(console.dir);
    return run();
};

// POST

//Login
const dbLogin = userInfo => {
    const client = new MongoClient(uri, {useUnifiedTopology: true});

    async function run() {
        try {
            await client.connect();
            const database = client.db("mwenbwa");
            const collection = database.collection("players");

            const query = {username: userInfo};
            const options = {};
            const cursor = await collection.find(query, options);
            const result = await cursor.toArray();

            //console.log(result);
            return result;
        } catch (err) {
            console.error(`Something went wrong: ${err}`);
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }

        return "done";
    }
    //run().catch(console.dir);
    return run();
};

//Register
const dbRegister = (userName, userPassword, userEmail, userColor) => {
    const client = new MongoClient(uri, {useUnifiedTopology: true});

    async function run() {
        try {
            await client.connect();
            const database = client.db("mwenbwa");
            const collection = database.collection("players");

            const newUser = {
                username: userName,
                password: userPassword,
                email: userEmail,
                color: userColor,
                score: 3000,
            };

            const result = await collection.insertOne(newUser);
            //const result = ("done");

            //console.log(result);
            return result;
        } catch (err) {
            console.error(`Something went wrong: ${err}`);
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }

        return "done";
    }
    //run().catch(console.dir);
    return run();
};

// GAME ACTIONS

//Buy tree
const dbBuyTree = (tree, userId, treePrice) => {
    const client = new MongoClient(uri, {useUnifiedTopology: true});

    //console.log(tree, userId, treePrice);

    async function run() {
        try {
            await client.connect();
            const database = client.db("mwenbwa");
            const collection = database.collection("trees");

            const treeId = new ObjectId(tree);
            const user = new ObjectId(userId);

            const filter = {_id: treeId};
            const options = {upsert: false};

            const updateDoc = {
                $set: {
                    owner: user,
                },
            };

            const result = await collection.updateOne(
                filter,
                updateDoc,
                options,
            );
            console.log(
                `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
            );

            //update the score oh the player with minus the price of the tree
            const collectionPlayer = database.collection("players");

            const filterPlayer = {_id: user};
            const optionsPlayer = {upsert: false};

            const updateDocPlayer = {
                $inc: {
                    score: -treePrice,
                },
            };

            const resultPlayer = await collectionPlayer.updateOne(
                filterPlayer,
                updateDocPlayer,
                optionsPlayer,
            );
            console.log(
                `${resultPlayer.matchedCount} document(s) matched the filter, updated ${resultPlayer.modifiedCount} document(s)`,
            );

            //Add a log of the action
            const collectionLog = database.collection("logs");

            const newLog = {
                content: " bought a tree",
                authorId: user,
            };

            const resultLog = await collectionLog.insertOne(newLog);

            console.log(
                `${resultLog.matchedCount} document(s) matched the filter, updated ${resultLog.modifiedCount} document(s)`,
            );

            //const playerName = await collectionPlayer.find({_id: user});
            //const playerInfo = await playerName.toArray();

            //return playerInfo;
        } catch (err) {
            console.error(`Something went wrong: ${err}`);
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }

        return "done";
    }
    //run().catch(console.dir);
    return run();
};

//Lock a tree
const dbLockTree = (tree, userId, treeLockPrice) => {
    const client = new MongoClient(uri, {useUnifiedTopology: true});

    async function run() {
        try {
            await client.connect();
            const database = client.db("mwenbwa");
            const collection = database.collection("trees");

            const treeId = new ObjectId(tree);
            const user = new ObjectId(userId);

            const filter = {_id: treeId};
            const options = {upsert: false};

            const updateDoc = {
                $set: {
                    locked: true,
                    owner: user,
                },
            };

            const result = await collection.updateOne(
                filter,
                updateDoc,
                options,
            );
            console.log(
                `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
            );

            //Update score with minus de locktree
            const collectionPlayer = database.collection("players");

            const filterPlayer = {_id: user};
            const optionsPlayer = {upsert: false};

            const updateDocPlayer = {
                $inc: {
                    score: -treeLockPrice,
                },
            };

            const resultPlayer = await collectionPlayer.updateOne(
                filterPlayer,
                updateDocPlayer,
                optionsPlayer,
            );
            console.log(
                `${resultPlayer.matchedCount} document(s) matched the filter, updated ${resultPlayer.modifiedCount} document(s)`,
            );

            //Add a log of the action
            const collectionLog = database.collection("logs");

            const newLog = {
                content: " locked a tree",
                authorId: user,
            };

            const resultLog = await collectionLog.insertOne(newLog);

            console.log(
                `${resultLog.matchedCount} document(s) matched the filter, updated ${resultLog.modifiedCount} document(s)`,
            );

            //const playerName = await collectionPlayer.find({_id: user});
            //const playerInfo = await playerName.toArray();

            //return playerInfo;
        } catch (err) {
            console.error(`Something went wrong: ${err}`);
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }

        return "done";
    }
    //run().catch(console.dir);
    return run();
};

//add log
const dbAddLog = (content, userId) => {
    const client = new MongoClient(uri, {useUnifiedTopology: true});

    async function run() {
        try {
            await client.connect();
            const database = client.db("mwenbwa");
            const collection = database.collection("logs");

            const newLog = {
                authorId: userId,
                content,
            };

            const result = await collection.insertOne(newLog);

            return result;
        } catch (err) {
            console.error(`Something went wrong: ${err}`);
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }

        return "done";
    }
    //run().catch(console.dir);
    return run();
};

//Add a comment
const dbAddComment = (tree, userId, newComment) => {
    const client = new MongoClient(uri, {useUnifiedTopology: true});

    async function run() {
        try {
            await client.connect();
            const database = client.db("mwenbwa");
            const collection = database.collection("trees");

            const treeId = new ObjectId(tree);
            const user = new ObjectId(userId);

            const query = {_id: treeId};
            const options = {upsert: false};

            const updateDoc = {
                $push: {
                    comments: [user, newComment],
                },
            };

            const result = await collection.updateOne(
                query,
                updateDoc,
                options,
            );
            return result;
        } catch (err) {
            console.error(`Something went wrong: ${err}`);
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }

        return "done";
    }
    //run().catch(console.dir);
    return run();
};

//CHANGE SETTINGS

//Change Color
const dbChangeColor = (userId, newColor) => {
    const client = new MongoClient(uri, {useUnifiedTopology: true});

    async function run() {
        try {
            await client.connect();
            const database = client.db("mwenbwa");
            const collection = database.collection("players");

            const filter = {username: userId};
            const options = {upsert: false};

            const updateDoc = {
                $set: {
                    color: newColor,
                },
            };

            const result = await collection.updateOne(
                filter,
                updateDoc,
                options,
            );
            console.log(
                `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
            );
        } catch (err) {
            console.error(`Something went wrong: ${err}`);
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }

        return "done";
    }
    //run().catch(console.dir);
    return run();
};

//Change Mail
const dbModifyMail = (userId, newMail) => {
    const client = new MongoClient(uri, {useUnifiedTopology: true});

    async function run() {
        try {
            await client.connect();
            const database = client.db("mwenbwa");
            const collection = database.collection("players");

            const filter = {username: userId};
            const options = {upsert: false};

            const updateDoc = {
                $set: {
                    email: newMail,
                },
            };

            const result = await collection.updateOne(
                filter,
                updateDoc,
                options,
            );
            console.log(
                `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
            );
        } catch (err) {
            console.error(`Something went wrong: ${err}`);
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }

        return "done";
    }
    //run().catch(console.dir);
    return run();
};

//Change Username
const dbModifyUsername = (userId, newUsername) => {
    const client = new MongoClient(uri, {useUnifiedTopology: true});

    async function run() {
        try {
            await client.connect();
            const database = client.db("mwenbwa");
            const collection = database.collection("players");

            const filter = {username: userId};
            const options = {upsert: false};

            const updateDoc = {
                $set: {
                    username: newUsername,
                },
            };

            const result = await collection.updateOne(
                filter,
                updateDoc,
                options,
            );
            console.log(
                `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
            );
        } catch (err) {
            console.error(`Something went wrong: ${err}`);
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }

        return "done";
    }
    //run().catch(console.dir);
    return run();
};

//Change Password
const dbModifyPassword = (userId, newPassword) => {
    const client = new MongoClient(uri, {useUnifiedTopology: true});

    async function run() {
        try {
            await client.connect();
            const database = client.db("mwenbwa");
            const collection = database.collection("players");

            const filter = {username: userId};
            const options = {upsert: false};

            const updateDoc = {
                $set: {
                    password: newPassword,
                },
            };

            const result = await collection.updateOne(
                filter,
                updateDoc,
                options,
            );
            console.log(
                `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
            );
        } catch (err) {
            console.error(`Something went wrong: ${err}`);
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }

        return "done";
    }
    //run().catch(console.dir);
    return run();
};

//Modify Profile Pics
const dbModifyPics = (userId, newPics) => {
    const client = new MongoClient(uri, {useUnifiedTopology: true});

    async function run() {
        try {
            await client.connect();
            const database = client.db("mwenbwa");
            const collection = database.collection("players");

            const filter = {username: userId};
            const options = {upsert: false};

            const updateDoc = {
                $set: {
                    picture: newPics,
                },
            };

            const result = await collection.updateOne(
                filter,
                updateDoc,
                options,
            );
            console.log(
                `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
            );
        } catch (err) {
            console.error(`Something went wrong: ${err}`);
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }

        return "done";
    }
    //run().catch(console.dir);
    return run();
};

//Get a user
const dbUpdate = () => {
    const client = new MongoClient(uri, {useUnifiedTopology: true});

    async function run() {
        try {
            await client.connect();
            const database = client.db("mwenbwa");
            const collection = database.collection("players");

            const result = await collection.updateMany(
                {},
                {$inc: {score: 2000}},
            );

            return result;
        } catch (err) {
            console.error(`Something went wrong: ${err}`);
        } finally {
            // Ensures that the client will close when you finish/error
            await client.close();
        }

        return "done";
    }
    //run().catch(console.dir);
    return run();
};

module.exports = {
    dbGetTrees,
    dbGetUser,
    dbGetUserFromInfo,
    dbGetLeaderboard,
    dbGetLogs,
    dbLogin,
    dbGetTree,
    dbRegister,
    dbBuyTree,
    dbLockTree,
    dbChangeColor,
    dbModifyMail,
    dbModifyUsername,
    dbModifyPassword,
    dbModifyPics,
    dbAddComment,
    dbAddLog,
    dbUpdate,
};
