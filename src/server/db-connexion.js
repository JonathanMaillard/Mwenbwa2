const MongoClient = require("mongodb").MongoClient;
const uri =
    "mongodb+srv://dev:shrek55@smaragdencluster.jzsi8.mongodb.net/mwenbwa?retryWrites=true&w=majority";
// let collection;

module.exports.MongoClient = MongoClient;
module.exports.uri = uri;
