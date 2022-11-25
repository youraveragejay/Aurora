const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Shows current queue")
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.deferReply();

    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player)
      return await interaction.editReply("there is no player for this guild.");

    const queue = player.queue;
    const embed = new EmbedBuilder().setAuthor({
      name: `Queue for ${interaction.guild.name}`,
    });

    // change for the amount of tracks per page
    const multiple = 10;
    const page = 1;

    const end = page * multiple;
    const start = end - multiple;

    const tracks = queue.slice(start, end);

    if (queue.current)
      embed.addFields([
        {
          name: "Current",
          value: `[${queue.current.title}](${queue.current.uri})`,
        },
      ]);

    if (!tracks.length)
      embed.setDescription(
        `No tracks in ${page > 1 ? `page ${page}` : "the queue"}.`
      );
    else
      embed.setDescription(
        tracks
          .map((track, i) => `${start + ++i} - [${track.title}](${track.uri})`)
          .join("\n")
      );

    const maxPages = Math.ceil(queue.length / multiple);

    embed.setFooter({
      text: `Page ${page > maxPages ? maxPages : page} of ${maxPages}`,
    });

    return await interaction.editReply({ embeds: [embed] });
  },
};
