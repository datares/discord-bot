const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const db = require("../db");
const { updateUserFromSheet } = require("./helpers");

async function execute(interaction) {
  const users = db.collection("users").find();
  const ids_in_guild = (await interaction.guild.members.fetch()).map(
    (member) => member.user.id
  );

  users.forEach(async (doc) => {
    if (doc && ids_in_guild.includes(doc.user_id)) {
      updateUserFromSheet(doc.email, doc.user_id, interaction.client);
    }
  });

  interaction.reply({
    content: "Updating users...",
    ephemeral: true,
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("update-all")
    .setDescription("update all users team roles and names (ADMIN ONLY!)")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute,
};
