const { MongoClient } = require("mongodb");

const connectionString = `mongodb+srv://admin:${process.env.MONGO_PASSWORD}@cluster0.7tfqkhl.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(connectionString);

const getDb = (collection) => {	
	const db = client.db('datares-discord-bot');
	return db.collection(collection);;
}

verification = getDb('verification');
users = getDb('users');

module.exports = { getDb, verification, users };
