const { getDb } = require('./db')

const whoami = async (user_id) => { 
    const db = getDb('users');
    const user_info = await db.findOne({user_id});
    return user_info;
}

module.exports = whoami;
