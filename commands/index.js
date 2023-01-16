const { Collection } = require('discord.js');
const iam = require('./iam');
const updateRoles = require('./update_roles');
const verify = require('./verify');
const whoami = require('./whoami');

let commands = [iam, updateRoles, verify, whoami];

module.exports = (client) => {
    client.commands = new Collection();
    commands.forEach(command => {
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.error(`Failed to register command ${command}, 'data' or 'execute' missing.`);
        }
    });
    client.on("interactionCreate", (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
        command.execute(interaction);
    })
};
