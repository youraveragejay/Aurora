const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("joins the voice channel")
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.deferReply();
    const client = interaction.client;

    if (!interaction.member.voice.channel)
      return interaction.editReply({
        content: "You need to be in a voice channel to use this command",
        ephemeral: true,
      });

    // Create player
    const player = client.manager.create({
      guild: interaction.guild.id,
      voiceChannel: interaction.member.voice.channel.id,
      textChannel: interaction.channel.id,
    });

    player.connect();

    return await interaction.editReply(`Joined Voice`);
  },
};
