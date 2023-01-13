const { users } = require('./db')
const {updateUserRoles} = require('./helpers');

const updateRoles = async (user_id, client) => {
    let data = null;
    try {
        data = await users.findOne({user_id});
    }
    catch (err) {
        console.log('Caught exception in /update-roles', err);
        return ['Error finding user in database.', null];
    }

    if (!data) {
        return ['User is not verified.  Please verify your account using /iam and /verify first', null];
    }

    try {
        const new_role = await updateUserRoles(data.email, user_id, client);
        await users.updateOne({user_id}, {$set: {
            team: new_role
        }})
    }

    catch (err) {
        console.log('Caught exception in /update-roles', err);
        return ['Error updating role in database.', null];
    }

    return [null, 'Successfully updated user roles according to our directory.']
};

module.exports = updateRoles;
