const { SlashCommandBuilder, StageChannel } = require("discord.js");
const {
  createAudioPlayer,
  createAudioResource,
  StreamType,
  demuxProbe,
  joinVoiceChannel,
  NoSubscriberBehavior,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  getVoiceConnection,
} = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("disconnect")
    .setDescription("Disconnects the bot from voice.")
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.reply(`Disconnected from voice.`);
    const connection = getVoiceConnection(
      interaction.member.voice.channel.guild.id
    );
    connection.destroy();
  },
};
