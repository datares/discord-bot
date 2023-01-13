const { SlashCommandBuilder } = require('discord.js');
const { ERROR_MESSAGE } = require('./constants');
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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('iam')
		.setDescription('Set your email address with the server')
		.addStringOption((option) =>
			option
				.setName('email')
				.setDescription('Your UCLA email address (or whatever email you think we have in our directory)')
				.setRequired(true),
		),
    async execute(interaction) {
		const email = interaction.options.get('email').value;
        const user_id = interaction.member.user.id;
        
        if (!validateEmail(email)) {
            interaction.reply({
                content: 'Your email doesn\'t appear to be a valid email. Please try again',
                ephemeral: true,
            });
            return null;
        }
    
        const verification_code = makeVerificationCode();
        try {
            await sendEmail(email, verification_code);
        }
        catch (err) {
            console.error('Caught exception in sending email.', err);
            interaction.reply({
                content: ERROR_MESSAGE,
                ephemeral: true
            });
            return 'Error sending email';
        }
    
        const doc = {
            verification_code: verification_code,
            email: email,
            user_id: user_id,
        };
    
        try {
            await verification.insertOne(doc); // TODO: replace existing doc
        }
        catch (err) {
            console.error('Caught exception in inserting document', err);
            interaction.reply({
                content: ERROR_MESSAGE,
                ephemeral: true
            });
            return 'Error calling database';
        }
    
        interaction.reply({
            content: 'Please check your email address for an authorization code',
            ephemeral: true
        });
        return null;
    }
};
