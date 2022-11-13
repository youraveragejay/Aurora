const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Resumes music")
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.deferReply();

    const queue = interaction.client.getQueue(interaction.guildId);

    if (!queue) return await interaction.editReply("No songs in queue");

    queue.setPaused(false);
    await interaction.editReply("Resumed player.");
  },
};
