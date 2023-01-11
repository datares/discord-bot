const { verification } = require('./db')
const sendEmail = require('./send_email');

const makeVerificationCode = () => {
    return Math.floor(Math.random() * 1000000);
}

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

const iam = async (email, user_id) => {
    if (!validateEmail(email)) {
        return 'invalid email';
    }

    const verification_code = makeVerificationCode();
    const res = await sendEmail(email, verification_code);
    console.log('Sent email', res)

    const doc = {
        verification_code: verification_code,
        email: email,
        user_id: user_id,
    }

    await verification.insertOne(doc);
    return 'success';
};

module.exports = iam;
