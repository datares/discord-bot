const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { updateSheet } = require("./read_sheet");

async function execute(interaction) {
  await updateSheet();
  interaction.reply({
    content: "Sheet updated",
    ephemeral: true,
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("update-sheet")
    .setDescription("update google sheet cached data (ADMIN ONLY!)")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute,
};