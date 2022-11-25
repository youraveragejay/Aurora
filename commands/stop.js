const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Clears the player and leaves voice")
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

    player.destroy();
    return await interaction.editReply("destroyed the player.");
  },
};
