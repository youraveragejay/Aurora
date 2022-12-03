const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { botColour } = require("../data/config");

function createEmbed(queue, tracks, start, page, maxPages, interaction) {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `Queue for ${interaction.guild.name}`,
    })
    .setColor(botColour)
    .setThumbnail(queue.current.thumbnail);

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

  embed.setFooter({
    text: `Page ${page > maxPages ? maxPages : page} of ${maxPages}`,
  });

  return embed;
}

function createRow(maxPages, page) {
  const row = new ActionRowBuilder();

  if (page === 1) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId("page_back_whole")
        .setEmoji(`⏪`)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId("page_back_single")
        .setEmoji(`◀`)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true)
    );
  } else {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId("page_back_whole")
        .setEmoji(`⏪`)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("page_back_single")
        .setEmoji(`◀`)
        .setStyle(ButtonStyle.Primary)
    );
  }

  if (page === maxPages) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId("page_forward_single")
        .setEmoji(`▶`)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true),
      new ButtonBuilder()
        .setCustomId("page_forward_whole")
        .setEmoji(`⏩`)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true)
    );
  } else {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId("page_forward_single")
        .setEmoji(`▶`)
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("page_forward_whole")
        .setEmoji(`⏩`)
        .setStyle(ButtonStyle.Primary)
    );
  }

  return row;
}

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

    // change for the amount of tracks per page
    const multiple = 10;
    let page = 1;

    const end = page * multiple;
    const start = end - multiple;

    const tracks = queue.slice(start, end);

    let maxPages = Math.ceil(queue.length / multiple);
    if (maxPages < 1) maxPages = 1;

    const embed = createEmbed(
      queue,
      tracks,
      start,
      page,
      maxPages,
      interaction
    );

    const row = createRow(maxPages, page);

    let message;

    if (maxPages === 1) {
      message = await interaction.editReply({
        embeds: [embed],
      });
    } else {
      message = await interaction.editReply({
        embeds: [embed],
        components: [row],
      });
    }

    const filter = (i) => i.user.id === interaction.user.id;

    const collector = message.createMessageComponentCollector({
      filter,
      time: "300000",
    });

    collector.on("collect", async (i) => {
      i.deferUpdate();
      let end;
      let start;
      let tracks;
      let maxPages;
      let embed;
      let row;

      switch (i.customId) {
        case "page_forward_single":
          page += 1;

          end = page * multiple;
          start = end - multiple;

          tracks = queue.slice(start, end);

          maxPages = Math.ceil(queue.length / multiple);
          if (maxPages < 1) maxPages = 1;

          embed = createEmbed(
            queue,
            tracks,
            start,
            page,
            maxPages,
            interaction
          );

          row = createRow(maxPages, page);

          message = await interaction.editReply({
            embeds: [embed],
            components: [row],
          });
          break;
        case "page_forward_whole":
          maxPages = Math.ceil(queue.length / multiple);
          if (maxPages < 1) maxPages = 1;
          page = maxPages;

          end = page * multiple;
          start = end - multiple;

          tracks = queue.slice(start, end);

          embed = createEmbed(
            queue,
            tracks,
            start,
            page,
            maxPages,
            interaction
          );

          row = createRow(maxPages, page);

          message = await interaction.editReply({
            embeds: [embed],
            components: [row],
          });
          break;
        case "page_back_single":
          page -= 1;

          end = page * multiple;
          start = end - multiple;

          tracks = queue.slice(start, end);

          maxPages = Math.ceil(queue.length / multiple);
          if (maxPages < 1) maxPages = 1;

          embed = createEmbed(
            queue,
            tracks,
            start,
            page,
            maxPages,
            interaction
          );

          row = createRow(maxPages, page);

          message = await interaction.editReply({
            embeds: [embed],
            components: [row],
          });
          break;
        case "page_back_whole":
          page = 1;

          end = page * multiple;
          start = end - multiple;

          tracks = queue.slice(start, end);

          maxPages = Math.ceil(queue.length / multiple);
          if (maxPages < 1) maxPages = 1;

          embed = createEmbed(
            queue,
            tracks,
            start,
            page,
            maxPages,
            interaction
          );

          row = createRow(maxPages, page);

          message = await interaction.editReply({
            embeds: [embed],
            components: [row],
          });
          break;
      }
    });
    collector.on("end", async (i) => {
      return;
    });
    return;
  },
};
