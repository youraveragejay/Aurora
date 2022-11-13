const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("disconnect")
    .setDescription("Disconnects the bot from voice and clears the queue")
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.deferReply();

    const queue = interaction.client.player.getQueue(interaction.guildId);

    if (!queue) return await interaction.editReply("No songs in queue");

    queue.destroy();
    await interaction.editReply("Disconnected from voice.");
  },
};
