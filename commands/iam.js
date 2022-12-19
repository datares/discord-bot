const { sendEmail } = require('./send_email');
const { getDb } = require('./db')

const makeVerificationCode = () => {
    return Math.floor(Math.random() * 1000000);
}

const iam = async (email, user_id) => {
	// const res = await sendEmail('colinpcurtis826@ucla.edu', '12345');
    // console.log(res);

    const verification_code = makeVerificationCode();

    const doc = {
        verification_code: verification_code,
        email: email,
        user_id: user_id,
    }

    const db = getDb();

    db.insert(doc);
};

module.exports = { iam };
