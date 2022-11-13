const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { botColour } = require("../data/config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current song")
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.deferReply();

    const queue = interaction.client.player.getQueue(interaction.guildId);

    if (!queue) return await interaction.editReply("No songs in queue");

    const currentSong = queue.current;

    const embed = new EmbedBuilder()
      .setDescription(`${currentSong.title} has been skipped`)
      .setThumbnail(currentSong.thumbnail).setColor(botColour);

    queue.skip();
    await interaction.editReply({ embeds: [embed] });
  },
};
