const { ERROR_MESSAGE } = require('./constants');
const { getDb } = require('./db')
const { SlashCommandBuilder } = require('discord.js');

async function execute(interaction) {
    const user_id = interaction.member.user.id;

    let user_info = null;
    try {
        const db = getDb('users');
        user_info = await db.findOne({user_id});
    }
    catch (err) {
        console.error('Caught exception in whoami', err);
        interaction.reply({
            content: ERROR_MESSAGE,
            ephemeral: true
        });
        return;
    }

    if (!user_info) {
        interaction.reply({
            content: 'Your account is not verified, please verify your account using /iam and /verify first.',
            ephemeral: true
        });
        return;
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
    
    interaction.reply({
        content: message,
        ephemeral: true
    });
}

module.exports = {
    data: new SlashCommandBuilder()
		.setName('whoami')
		.setDescription('View your user information'),
    execute
};
