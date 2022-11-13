const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skipto")
    .setDescription("Skips to a certain track")
    .addNumberOption((option) =>
      option
        .setName(`index`)
        .setDescription(`The index of the track to skip to`)
        .setMinValue(1)
        .setRequired(true)
    )
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.deferReply();

    const queue = interaction.client.player.getQueue(interaction.guildId);

    if (!queue) return await interaction.editReply("No songs in queue");

    const trackNum = interaction.options.getNumber(`index`);
    if (trackNum > queue.tracks.length)
      return await interaction.editReply(
        `The queue only has ${queue.tracks.length} songs`
      );

    queue.skipTo(trackNum - 1);
    await interaction.editReply(`Skipped ahead to track number ${trackNum}`);
  },
};
