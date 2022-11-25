const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Sets the volume of the player")
    .addIntegerOption((option) =>
      option
        .setName("volume")
        .setDescription("Volume between 1 and 100")
        .setRequired(true)
    )
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

    const volume = interaction.options.getInteger("volume");

    if (!volume || volume < 1 || volume > 100)
      return await interaction.editReply(
        "you need to give me a volume between 1 and 100."
      );

    player.setVolume(volume);
    return await interaction.editReply(
      `set the player volume to \`${volume}\`.`
    );
  },
};
