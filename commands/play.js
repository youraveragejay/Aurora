const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song in voice")
    .addStringOption((option) =>
      option
        .setName(`input`)
        .setDescription(`A search term or a link`)
        .setRequired(true)
    )
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.deferReply();
    if (!interaction.member.voice.channel)
      return await interaction.editReply(
        `You need to be in a voice channel to use this command`
      );
    const queue = await interaction.client.player.createQueue(
      interaction.guild
    );
    if (!queue.connection)
      await queue.connect(interaction.member.voice.channel);

    const embed = new EmbedBuilder();

    let url = interaction.options.getString(`input`);
    const result = await interaction.client.player.search(url, {
      requestedBy: interaction.user,
      searchEngine: QueryType.SPOTIFY_SONG,
    });
    if (result.tracks.length === 0)
      return await interaction.editReply("No results found");

    const song = result.tracks[0];
    await queue.addTrack(song);
    embed
      .setDescription(
        `**[${song.title}](${song.url})** has been added to the queue`
      )
      .setThumbnail(song.thumbnail)
      .setFooter({ text: `Duration: ${song.duration}` });

    if (!queue.playing) await queue.play();

    await interaction.editReply({ embeds: [embed] });
  },
};
