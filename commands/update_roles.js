const { getDb } = require('./db')
const {updateUserRoles} = require('./helpers');

const updateRoles = async (user_id, client) => {
    const db = getDb('users');
    const data = await db.findOne({user_id});
    if (!data) {
        return 'not verified';
    }
    const new_role = await updateUserRoles(data.email, user_id, client);
    await db.updateOne({user_id}, {$set: {
        team: new_role
    }})
};

module.exports = updateRoles;
