const { MongoClient } = require("mongodb");

const connectionString = `mongodb+srv://admin:${process.env.MONGO_PASSWORD}@cluster0.7tfqkhl.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(connectionString);

const db = client.db("datares-discord-bot");

module.exports = db;
