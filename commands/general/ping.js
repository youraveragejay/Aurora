const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Returns bot latency.")
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.reply({
      content: `PONG! ${interaction.client.ws.ping} ms`,
      ephemeral: true
    });
  },
};
