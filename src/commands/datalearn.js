const { ERROR_MESSAGE } = require("./constants");
const { addRoleToUser } = require("./helpers");
const { SlashCommandBuilder } = require("discord.js");

async function execute(interaction) {
  const user_id = interaction.member.user.id;
  const client = interaction.client;

  try {
    await addRoleToUser(client, user_id, "DataLearn");
  } catch (err) {
    console.error("Caught exception in /datalearn", err);
    interaction.reply({
      content: ERROR_MESSAGE,
      ephemeral: true,
    });
    return;
  }

  interaction.reply({
    content: "Successfully added DataLearn role to user",
    ephemeral: true,
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("datalearn")
    .setDescription(
      "Give yourself the DataLearn role (use if you are a member of DataLearn)"
    ),
  execute,
};
