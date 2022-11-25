const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips current track")
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.deferReply();

    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player)
      return await interaction.editReply("there is no player for this guild.");

    const { channel } = interaction.member.voice;

    if (!channel)
      return await interaction.editReply("you need to join a voice channel.");
    if (channel.id !== player.voiceChannel)
      return await interaction.editReply(
        "you're not in the same voice channel."
      );

    if (!player.queue.current)
      return await interaction.editReply("there is no music playing.");

    const { title } = player.queue.current;

    player.stop();
    return await interaction.editReply(`${title} was skipped.`);
  },
};
