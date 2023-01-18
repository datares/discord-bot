const SES = require("aws-sdk/clients/ses");

const SES_CONFIG = {
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
};

const AWS_SES = new SES(SES_CONFIG);

const sendEmail = (recipientEmail, verificationCode) => {
  const params = {
    Source: "datares@ucla.edu",
    Destination: {
      ToAddresses: [recipientEmail],
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `Howdy!\nYour Discord verification code is ${verificationCode}.`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Your DataRes@UCLA Discord Verification Code",
      },
    },
  };
  return AWS_SES.sendEmail(params).promise();
};

module.exports = sendEmail;
