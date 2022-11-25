const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Plays a song in voice")
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("A search term or url")
        .setRequired(true)
    )
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

    if (player.state !== "CONNECTED") player.connect();

    const search = interaction.options.getString("input");
    let res;

    try {
      res = await client.manager.search(search, interaction.user);

      if (res.loadType === "LOAD_FAILED") {
        if (!player.queue.current) player.destroy;
        throw res.exception;
      }
    } catch (err) {
      return await interaction.editReply({
        content: `There was an error while searching: ${err.message}`,
        ephemeral: true,
      });
    }

    switch (res.loadType) {
      case "NO_MATCHES":
        if (!player.queue.current) player.destroy();
        return await interaction.editReply("there were no results found.");
      case "TRACK_LOADED":
        player.queue.add(res.tracks[0]);

        if (!player.playing && !player.paused && !player.queue.size)
          player.play();
        return await interaction.editReply(
          `enqueuing \`${res.tracks[0].title}\`.`
        );
      case "PLAYLIST_LOADED":
        player.queue.add(res.tracks);

        if (
          !player.playing &&
          !player.paused &&
          player.queue.totalSize === res.tracks.length
        )
          player.play();
        return await interaction.editReply(
          `enqueuing playlist \`${res.playlist.name}\` with ${res.tracks.length} tracks.`
        );
      case "SEARCH_RESULT": {
        let max = 5,
          collected,
          filter = (m) =>
            m.author.id === interaction.user.id &&
            /^(\d+|end)$/i.test(m.content);
        if (res.tracks.length < max) max = res.tracks.length;

        const results = res.tracks
          .slice(0, max)
          .map((track, index) => `${++index} - \`${track.title}\``)
          .join("\n");

        await interaction.editReply(results);

        try {
          collected = await interaction.channel.awaitMessages({
            filter,
            max: 1,
            time: 30e3,
            errors: ["time"],
          });
        } catch (e) {
          if (!player.queue.current) player.destroy();
          return await interaction.editReply("you didn't provide a selection.");
        }

        const first = collected.first().content;

        if (first.toLowerCase() === "end") {
          if (!player.queue.current) player.destroy();
          return await interaction.editReply("Cancelled selection.");
        }

        const index = Number(first) - 1;
        if (index < 0 || index > max - 1)
          return await interaction.editReply(
            `the number you provided too small or too big (1-${max}).`
          );

        const track = res.tracks[index];
        player.queue.add(track);

        if (!player.playing && !player.paused && !player.queue.size)
          player.play({
            volume: 25,
          });

        return await interaction.editReply(`enqueuing \`${track.title}\`.`);
      }
    }
  },
};
