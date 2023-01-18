# DataRes Discord Bot

Simple discord bot to verify member emails and apply roles according to our directory.

Emails are sent using AWS Simple Email Service and data is stored in MongoDB

# Development

- Put following secrets in the `.env` file
  `DISCORD_TOKEN,
CLIENT_ID,
GUILD_ID,
AWS_KEY_ID,
AWS_SECRET,
AWS_REGION,
GOOGLE_API_KEY,
SHEET_ID,
SERVER_ID,
MONGO_PASSWORD,`

Run `npm run dev` to start the discord bot.

# Deploying

This is hosted on an AWS Free Tier EC2 Instance. To deploy the server, first launch the instance and install nodejs and nvm using [this guide](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04).

Then, clone this repository, and run `npn i` to install the packages, and run `nvm use` to install the correct version of nodejs.

Next, run `npm i -g forever`, which is a package that allows us to run our server as a daemon so we don't have to worry about restarting the server if it breaks. Also, populate `.env` with the secrets from development.

To start the server, run `forever start -c 'node index.js' ./`, and you can verify that it started by running `forever list`, which should show the uptime and log file path.

To redeploy, pull changes from git and run `forever restartall`.

If the log file for forever changes as denoted by `forever list`, then you will have to update the AWS Cloudwatch config file, which is stored in `/opt/aws/amazon-cloudwatch-agent/bin/config.json`. In that case, edit `log_file_path` to point to the new log file. Finally, run

```bash
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/bin/config.json -s
```

to restart the Cloudwatch agent.
