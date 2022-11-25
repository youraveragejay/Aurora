const { SlashCommandBuilder } = require("discord.js");

const levels = {
  none: 0.0,
  low: 0.1,
  medium: 0.15,
  high: 0.25,
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bassboost")
    .setDescription("Sets the boost of the bass")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Type of boost")
        .addChoices(
          { name: "none", value: "none" },
          { name: "low", value: "low" },
          { name: "medium", value: "medium" },
          { name: "high", value: "high" }
        )
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

    let level = "none";
    if (interaction.options.getString("type") in levels)
      level = interaction.options.getString("type");

    const bands = new Array(3)
      .fill(null)
      .map((_, i) => ({ band: i, gain: levels[level] }));

    player.setEQ(...bands);

    return await interaction.editReply(`set the bassboost level to ${level}`);
  },
};
