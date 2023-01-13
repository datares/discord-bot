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
        return [null, 'Your email doesn\'t appear to be a valid email. Please try again'];
    }

    const verification_code = makeVerificationCode();
    try {
        await sendEmail(email, verification_code);
    }
    catch (err) {
        console.log('Caught exception in sending email.', err);
        return ['Error sending email', null];
    }

    const doc = {
        verification_code: verification_code,
        email: email,
        user_id: user_id,
    }

    try {
        await verification.insertOne(doc); // TODO: replace existing doc
    }
    catch (err) {
        return ['Error calling database', null];
    }

    return [null, 'Please check your email address for an authorization code'];
};

module.exports = iam;
