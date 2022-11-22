const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QueueRepeatMode } = require(`discord-player`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Sets volume of player")
    .addIntegerOption((option) =>
      option
        .setName(`volume`)
        .setDescription(`The volume to set to`)
        .setRequired(true)
    )
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.deferReply();

    const volume = interaction.options.getInteger(`volume`);

    const queue = interaction.client.player.getQueue(interaction.guildId);

    if (!queue) return await interaction.editReply("No songs in queue");

    if (volume < 0 || volume > 100){
      await interaction.editReply("Volume must be between 0 and 100")
    }

    queue.setVolume(volume);
    await interaction.editReply(`Set volume to ${volume}`);
  },
};
