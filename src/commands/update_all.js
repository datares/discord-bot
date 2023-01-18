const { SlashCommandBuilder } = require("discord.js");
const db = require("../db");
const { updateUserFromSheet } = require("./helpers");

async function execute(interaction) {
  // TODO: Make admin only
  const users = db.collection("users").find();
  const ids_in_guild = (await interaction.guild.members.fetch()).map(
    (member) => member.user.id
  );

  users.forEach(async (doc) => {
    if (doc && ids_in_guild.includes(doc.user_id)) {
      updateUserFromSheet(doc.email, doc.user_id, interaction.client);
    }
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("update-all")
    .setDescription("update all users team roles and names (ADMIN ONLY!)"),
  execute,
};
