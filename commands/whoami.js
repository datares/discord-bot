const { getDb } = require('./db')

const whoami = async (user_id) => {
    let user_info = null;
    try {
        const db = getDb('users');
        user_info = await db.findOne({user_id});
    }
    catch (err) {
        console.log('Caught exception in whoami', err);
        return ['Error when calling database', null];
    }

    if (!user_info) {
        return [null, 'Your account is not verified, please verify your account using /iam and /verify first.'];
    }

    let message = '';
    if (user_info.name) {
        message += `Name: ${user_info.name}\n`
    }
    if (user_info.email) {
        message += `Email: ${user_info.email}\n`
    }
    if (user_info.team) {
        message += `Team: ${user_info.team}\n`
    }

    return [null, message];
}

module.exports = whoami;
