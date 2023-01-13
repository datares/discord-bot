const { ERROR_MESSAGE } = require('./constants');
const { verification, users } = require('./db')
const { updateUserRoles } = require('./helpers')

const addVerifiedUser = async (user_id, email, team) => {
    const doc = { user_id, email, team };
    await users.insertOne(doc);
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('verify your email with the server')
    .addIntegerOption((option) =>
        option
            .setName('code')
            .setDescription('Your email verification code')
            .setRequired(true)
        ),
    async execute(interaction) {
        const code = interaction.options.get("code").value;
        const user_id = interaction.member.user.id;
        const client = interaction.client;

        const doc = {user_id, verification_code: code};
        let userVerification = null;
        try {
            userVerification = await verification.findOne(doc);
        }
        catch (err) {
            console.error('Caught exception in /verify', err);
            interaction.reply({
                content: ERROR_MESSAGE,
                ephemeral: true
            });
            return 'Error when calling database';
        }

        if (!userVerification || userVerification.verification_code !== code) {
            interaction.reply({
                content: 'The code you entered is not correct. Please try again.',
                ephemeral: true
            })
            return null;
        }

        const email = userVerification.email;
        const role = await updateUserRoles(email, user_id, client);
        if (!role) {
            // user not found in sheet
            interaction.reply({
                content: 'You don\'t appear to be listed in the member directory.  If this is an error, please contact leadership.',
                ephemeral: true
            });
            return null;
        }

        try {
            addVerifiedUser(user_id, email, role);
            await verification.deleteOne(doc);
        }
        catch (err) {
            console.error('Caught exception in /verify', err);
            interaction.reply({
                content: ERROR_MESSAGE,
                ephemeral: true
            })
            return 'Error when updating user roles.';
        }

        interaction.reply({
            content: 'Successfully verified your account.',
            ephemeral: true
        });
        return null;
    }
};
