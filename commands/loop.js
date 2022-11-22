const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QueueRepeatMode } = require(`discord-player`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Loops current queue")
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.deferReply();

    const queue = interaction.client.player.getQueue(interaction.guildId);

    if (!queue) return await interaction.editReply("No songs in queue");

    queue.setRepeatMode(QueueRepeatMode.QUEUE);
    await interaction.editReply(
      "Queue has been looped."
    );
  },
};
