const { getDb } = require('./db')
const sendEmail = require('./send_email');

const makeVerificationCode = () => {
    return Math.floor(Math.random() * 1000000);
}

const iam = async (email, user_id) => {
    const verification_code = makeVerificationCode();
    const res = await sendEmail(email, verification_code);
    console.log(res)

    const doc = {
        verification_code: verification_code,
        email: email,
        user_id: user_id,
    }

    const db = getDb('verification');

    await db.insertOne(doc);
};

module.exports = iam;
