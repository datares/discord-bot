const { verification, users } = require('./db')
const { updateUserRoles } = require('./helpers')

const addVerifiedUser = async (user_id, email, team) => {
    const doc = { user_id, email, team };
    await users.insertOne(doc);
}

const verify = async (code, user_id, client) => {
    const doc = {user_id, verification_code: code};
    let userVerification = null;
    try {
        userVerification = await verification.findOne(doc);
    }
    catch (err) {
        console.log('Caught exception in /verify', err);
        return ['Error when calling database', null];
    }

    if (!userVerification || userVerification.verification_code !== code) {
        return [null, 'The code you entered is not correct. Please try again.'];
    }

    const email = userVerification.email;
    const role = await updateUserRoles(email, user_id, client);
    if (!role) {
        // user not found in sheet
        return [null, 'You don\'t appear to be listed in the member directory.  If this is an error, please contact leadership.']
    }

    try {
        addVerifiedUser(user_id, email, role);
        await verification.deleteOne(doc);
    }
    catch (err) {
        console.log('Caught exception in /verify', err);
        return ['Error when updating user roles.', null];
    }

    return [null, 'Successfully verified your account.'];
};

module.exports = verify;
