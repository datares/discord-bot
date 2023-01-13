const { REST, Client, GatewayIntentBits, SlashCommandBuilder, Routes } = require('discord.js');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

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

	let err, message = null;

	if (commandName === 'ping') {
		await interaction.reply({ content: 'Pong!', ephemeral: true });
		console.log('Ran command ping');
	}
	else if (commandName === 'server') {
		await interaction.reply({ content: `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`, ephemeral: true });
	}
	else if (commandName === 'iam') {
		const email = args.get('email').value;
		[err, message] = await iam(email, user_id);
	}
	else if (commandName === 'verify') {
		const code = args.get('code').value;
		[err, message] = await verify(code, user_id, client);
	}
	else if (commandName === 'update-roles') {
		[err, message] = await updateRoles(user_id, client);
	}
	else if (commandName === 'whoami') {
		[err, message] = await whoami(user_id);
	}

	if (message) {
		interaction.reply({ content: message, ephemeral: true });
	}
	else if (err) {
		interaction.reply({ content: 'Oopsie! Something went wrong on our end.  If this persists, contact leadership', ephemeral: true });
		console.log(`Command ${commandName} failed`, err)
	}
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
