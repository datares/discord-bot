const { users } = require('./db')
const {updateUserRoles} = require('./helpers');

const updateRoles = async (user_id, client) => {
    const data = await users.findOne({user_id});
    if (!data) {
        return 'not verified';
    }
    const new_role = await updateUserRoles(data.email, user_id, client);
    await users.updateOne({user_id}, {$set: {
        team: new_role
    }})
    return 'success'
};

module.exports = updateRoles;
