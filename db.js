const { MongoClient } = require("mongodb");

const connectionString = process.env.MONGO_URI;
const client = new MongoClient(connectionString);

const db = client.db("datares-discord-bot");

module.exports = db;
