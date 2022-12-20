const { getDb } = require('./db')
const {updateUserRoles} = require('./helpers')

const addVerifiedUser = async (user_id, email, team) => {
    const db = getDb('users');
    const doc = { user_id, email, team };
    await db.insertOne(doc);
}

const verify = async (code, user_id, client) => {
    const db = getDb('verification');
    const doc = {user_id, verification_code: code};
    const userVerification = await db.findOne(doc);
    if (!userVerification || userVerification.verification_code !== code) {
        return 'incorrect code';
    }
    const email = userVerification.email;
    const role = await updateUserRoles(email, user_id, client);
    addVerifiedUser(user_id, email, role);
    await db.deleteOne(doc);
};

module.exports = verify;
