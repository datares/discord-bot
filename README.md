# DataRes Discord Bot

Simple discord bot to verify member emails and apply roles according to our directory.

Emails are sent using AWS Simple Email Service and data is stored in MongoDB

# Setup

- Put following secrets in the `.env` file
`
DISCORD_TOKEN,
CLIENT_ID,
GUILD_ID,
AWS_KEY_ID,
AWS_SECRET,
AWS_REGION,
GOOGLE_API_KEY,
SHEET_ID,
SERVER_ID,
MONGO_PASSWORD,
`

# Running

Run `npm run dev`
