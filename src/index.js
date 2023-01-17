const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const registerCommands = require('./commands');

const SERVER_ID = process.env.SERVER_ID;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
let server = null;

// When the client is ready, run this code (only once)
client.once('ready', async () => {
	console.log('Ready!');
	server = await client.guilds.fetch(SERVER_ID);
	registerCommands(client);
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
