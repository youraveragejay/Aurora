const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffles the current queue")
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.deferReply();

    const queue = interaction.client.player.getQueue(interaction.guildId);

    if (!queue) return await interaction.editReply("No songs in queue");

    queue.shuffle();
    await interaction.editReply(`Queue of ${queue.tracks.length} songs have been shuffled`);
  },
};
