// Require the necessary discord.js classes
const { REST, Client, GatewayIntentBits, SlashCommandBuilder, Routes } = require('discord.js');
require('dotenv').config();
const { verify } = require('./commands/verify');
const { iam } = require('./commands/iam');


// db.insert({user_id: '123', email: 'abc@gmail.com'})
// db.find({user_id: '123'}, (err, docs) => console.log(docs))


const SERVER_ID = process.env.SERVER_ID;

const commands = [
	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
	new SlashCommandBuilder().setName('verify').setDescription('verify your email with the server')
		.addIntegerOption((option) =>
			option.setName('code').setDescription('Your email verification code')),
	new SlashCommandBuilder().setName('iam').setDescription('Set your email address with the server')
		.addStringOption((option) =>
			option.setName('email').setDescription('Your UCLA email address'),
		),
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
	const member = await server.members.fetch(user_id);
	const channel = await server.channels.cache.get(interaction.channelId);

	console.log(args);

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	}
	else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	}
	else if (commandName === 'user') {
		await interaction.reply('User info.');
	}
	else if (commandName === 'iam') {
		const email = args.get('email').value;
		await iam(email, user_id);
		await interaction.reply('Please check your email address for an authorization code');
	}
	else if (commandName === 'verify') {
		console.log(args);
		const code = args.get('code').value;
		await verify(code, user_id, client, interaction);
	}
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
