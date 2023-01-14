const { ERROR_MESSAGE } = require('./constants');
const { users } = require('./db')
const {updateUserRoles} = require('./helpers');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
		.setName('update-roles')
		.setDescription('update your team roles based on our directory'),
    async execute(interaction) {
        const user_id = interaction.member.user.id;
        const client = interaction.client;

        let data = null;
        try {
            data = await users.findOne({user_id});
        }
        catch (err) {
            console.error('Caught exception in /update-roles', err);
            interaction.reply({
                content: ERROR_MESSAGE,
                ephemeral: true
            });
            return 'Error finding user in database.';
        }
    
        if (!data) {
            interaction.reply({
                content: 'User is not verified.  Please verify your account using /iam and /verify first',
                ephemeral: true
            });
            return null;
        }
    
        try {
            const new_role = await updateUserRoles(data.email, user_id, client);
            await users.updateOne({user_id}, {$set: {
                team: new_role
            }})
        }
        catch (err) {
            console.error('Caught exception in /update-roles', err);
            interaction.reply({
                content: ERROR_MESSAGE,
                ephemeral: true
            })
            return 'Error updating role in database.';
        }
    
        interaction.reply({
            content: 'Successfully updated user roles according to our directory.',
            ephemeral: true
        });
        return null;
    }
};
