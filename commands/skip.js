const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song")
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.deferReply();

    const queue = interaction.client.getQueue(interaction.guildId);

    if (!queue) return await interaction.editReply("No songs in queue");

    const currentSong = queue.current;

    const embed = new EmbedBuilder()
      .setDescription(`${currentSong.title} has been skipped`)
      .setThumbnail(currentSong.thumbnail);

    queue.skip();
    await interaction.editReply({ embeds: [embed] });
  },
};
