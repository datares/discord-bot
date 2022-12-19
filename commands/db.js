const Datastore = require('nedb');

// const db = {};

const getDb = () => {
	const db = new Datastore({ filename: 'db/verification.db', autoload: true });
	db.loadDatabase();
	return db;
}

module.exports = { getDb };
