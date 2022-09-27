const play = require("play-dl"); // Everything
const { SlashCommandBuilder } = require("discord.js");
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
    .setName("play")
    .setDescription("Plays a song in voice.")
    .addStringOption((option) =>
      option
        .setName(`song`)
        .setDescription(`The song to play`)
        .setRequired(true)
    )
    .setDMPermission(false),
  async execute(interaction) {
    let song = interaction.options.getString(`song`);

    // Check if user is in VC
    if (!interaction.member.voice?.channel)
      return await interaction.reply("Connect to a Voice Channel");

    // Connect to VC
    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    // Search for the song
    let yt_info = await play.search(song, {
      limit: 1,
    });

    // Setup the audio player
    let stream = await play.stream(yt_info[0].url);

    let resource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });

    let player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
      },
    });

    // Play
    player.play(resource);

    connection.subscribe(player);
  },
};
