const { Collection, REST, Routes } = require('discord.js');
const iam = require('./iam');
const updateRoles = require('./update_roles');
const verify = require('./verify');
const whoami = require('./whoami');
const datalearn = require('./datalearn');

const commands = [iam, updateRoles, verify, whoami, datalearn];

module.exports = (client) => {
    // Collate commands into Collection
    client.commands = new Collection();
    commands.forEach(command => {
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.error(`Failed to register command ${command}, 'data' or 'execute' missing.`);
        }
    });
    // Register commands with Discord API
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: client.commands.map(command => command.data.toJSON()) },
            );
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch(error) {
            console.error(error);
        }
    })();

    // Handle commands
    client.on("interactionCreate", (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
        command.execute(interaction);
    });
};
