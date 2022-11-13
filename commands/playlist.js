const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");
const { botColour } = require("../data/config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playlist")
    .setDescription("Plays a playlist in voice")
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`play`)
        .setDescription("Plays a playlist in voice")
        .addStringOption((option) =>
          option
            .setName(`input`)
            .setDescription(`A search term or a link`)
            .setRequired(true)
        )
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

    switch (interaction.options.getSubcommand()) {
      case `play`:
        let url = interaction.options.getString(`input`);
        const result = await interaction.client.player.search(url, {
          requestedBy: interaction.user,
          searchEngine: QueryType.SPOTIFY_PLAYLIST,
        });
        if (result.tracks.length === 0)
          return await interaction.editReply("No results found");

        const playlist = result.playlist;
        await queue.addTracks(result.tracks);
        embed
          .setDescription(
            `**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the queue`
          )
          .setThumbnail(playlist.thumbnail)
          .setColor(botColour);

        if (!queue.playing) await queue.play();
        break;
    }

    await interaction.editReply({ embeds: [embed] });
  },
};
