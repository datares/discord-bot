const { REST, Client, GatewayIntentBits, SlashCommandBuilder, Routes } = require('discord.js');
require('dotenv').config();

const {iam, verify, updateRoles, whoami} = require('./commands');

const SERVER_ID = process.env.SERVER_ID;

const commands = [
	new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong!'),
	new SlashCommandBuilder()
		.setName('server')
		.setDescription('Replies with server info!'),
	new SlashCommandBuilder()
		.setName('verify')
		.setDescription('verify your email with the server')
		.addIntegerOption((option) =>
			option
				.setName('code')
				.setDescription('Your email verification code')
				.setRequired(true)
			),
	new SlashCommandBuilder()
		.setName('iam')
		.setDescription('Set your email address with the server')
		.addStringOption((option) =>
			option
				.setName('email')
				.setDescription('Your UCLA email address (or whatever email you think we have in our directory)')
				.setRequired(true),
		),
	new SlashCommandBuilder()
		.setName('update-roles')
		.setDescription('update your team roles based on our directory'),
	new SlashCommandBuilder()
		.setName('whoami')
		.setDescription('View your user information'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let server = null;

// When the client is ready, run this code (only once)
client.once('ready', async () => {
	console.log('Ready!');
	server = await client.guilds.fetch(SERVER_ID);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const { commandName } = interaction;
	const user_id = interaction.member.user.id;
	const args = interaction.options;

	if (commandName === 'ping') {
		await interaction.reply({ content: 'Pong!', ephemeral: true });
		console.log('Ran command ping');
	}
	else if (commandName === 'server') {
		await interaction.reply({ content: `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`, ephemeral: true });
	}
	else if (commandName === 'iam') {
		const email = args.get('email').value;
		const res = await iam(email, user_id);
		if (res === 'invalid email') {
			await interaction.reply({ content: 'The email address you entered is not valid.  Please try again', ephemeral: true });
			return;
		}
		await interaction.reply({ content: 'Please check your email address for an authorization code', ephemeral: true });
	}
	else if (commandName === 'verify') {
		const code = args.get('code').value;
		const res = await verify(code, user_id, client);
		if (res === 'incorrect code') {
			await interaction.reply({ content: 'Entered incorrect verification code, please try again', ephemeral: true });
			return;
		}
		await interaction.reply({ content: 'Successfully verified your account', ephemeral: true });
	}
	else if (commandName === 'update-roles') {
		const res = await updateRoles(user_id, client);
		if (res === 'not verified') {
			await interaction.reply({ content: 'Your account is not verified, please verify your account using /iam and /verify first', ephemeral: true });
			return;
		}
		await interaction.reply({ content: 'User roles have been updated according to our directory', ephemeral: true });
	}
	else if (commandName === 'whoami') {
		const res = await whoami(user_id);
		if (!res) {
			await interaction.reply({ content: 'Your account is not verified, please verify your account using /iam and /verify first', ephemeral: true });
			return;
		}
		await interaction.reply({ content: `Email: ${res.email}\nTeam: ${res.team}`, ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
