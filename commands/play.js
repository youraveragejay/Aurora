const play = require("play-dl"); // Everything
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
    await interaction.deferReply();
    let song = interaction.options.getString(`song`);

    // Check if user is in VC
    if (
      !interaction.member.voice?.channel ||
      typeof interaction.member.voice.channel === StageChannel
    )
      return await interaction.reply("Connect to a Voice Channel");

    // Connect to VC
    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    if (play.yt_validate(interaction.options.getString(`song`)) === "video") {
      console.log(play.yt_validate(interaction.options.getString(`song`)));
      let yt_info = await play.video_info(
        interaction.options.getString(`song`)
      );
      let stream = await play.stream_from_info(yt_info);
      let resource = createAudioResource(stream.stream, {
        inputType: stream.type,
      });

      let player = createAudioPlayer({
        behaviors: {
          noSubscriber: NoSubscriberBehavior.Play,
        },
      });

      player.play(resource);

      connection.subscribe(player);
      await interaction.followUp(`Now playing ${yt_info.video_details.url}`);
    } else {
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
      await interaction.followUp(`Now playing ${yt_info[0]}`);
    }
  },
};
