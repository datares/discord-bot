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
		await interaction.reply('Pong!');
		console.log('Ran command ping');
	}
	else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	}
	else if (commandName === 'iam') {
		const email = args.get('email').value;
		const res = await iam(email, user_id);
		if (res === 'invalid email') {
			await interaction.reply('The email address you entered is not valid.  Please try again');
			return;
		}
		await interaction.reply('Please check your email address for an authorization code');
	}
	else if (commandName === 'verify') {
		const code = args.get('code').value;
		const res = await verify(code, user_id, client);
		if (res === 'incorrect code') {
			await interaction.reply('Entered incorrect verification code, please try again');
			return;
		}
		await interaction.reply('Successfully verified your account');
	}
	else if (commandName === 'update-roles') {
		const res = await updateRoles(user_id, client);
		if (res === 'not verified') {
			await interaction.reply('Your account is not verified, please verify your account using /iam and /verify first');
			return;
		}
		await interaction.reply('User roles have been updated according to our directory');
	}
	else if (commandName === 'whoami') {
		const res = await whoami(user_id);
		if (!res) {
			await interaction.reply('Your account is not verified, please verify your account using /iam and /verify first');
			return;
		}
		await interaction.reply(`Email: ${res.email}\nTeam: ${res.team}`);
	}
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
