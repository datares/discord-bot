const { verification, users } = require('./db')
const { updateUserRoles } = require('./helpers')

const addVerifiedUser = async (user_id, email, team) => {
    const doc = { user_id, email, team };
    await users.insertOne(doc);
}

const verify = async (code, user_id, client) => {
    const doc = {user_id, verification_code: code};
    const userVerification = await verification.findOne(doc);
    if (!userVerification || userVerification.verification_code !== code) {
        return 'incorrect code';
    }
    const email = userVerification.email;
    const role = await updateUserRoles(email, user_id, client);
    if (!role) {
        return 'not-a-member';
    }
    addVerifiedUser(user_id, email, role);
    await verification.deleteOne(doc);
    return 'success';
};

module.exports = verify;
