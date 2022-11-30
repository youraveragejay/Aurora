const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const { botColour } = require("../data/config");

function createRow(maxPages, page = 1) {
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
    .setName("help")
    .setDescription("Returns a list of useful commands")
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.deferReply();

    const settingsEmbed = new EmbedBuilder()
      .setTitle("⚙️ Settings")
      .setDescription("Settings for the bot")
      .setColor(botColour)
      .addFields(
        {
          name: "/settings welcomechannel",
          value: "Set the channel to send welcome messages to",
        },
        {
          name: "/settings levelupchannel",
          value: "Set the channel to send level up messages to",
        },
        {
          name: "/settings shownsfwposts",
          value: "Sets whether to show posts flagged as NSFW from reddit",
        }
      );

    const musicEmbed = new EmbedBuilder()
      .setTitle("🎶 Music")
      .setDescription("Music commands")
      .setColor(botColour)
      .addFields(
        {
          name: "/play",
          value: "Plays a song requested in the users voice channel",
        },
        { name: "/pause", value: "Pauses the current player" },
        { name: "/resume", value: "Resumes the player if paused" },
        { name: "/skip", value: "Skips the current song" },
        { name: "/queue", value: "Shows the current queue" },
        {
          name: "/bassboost",
          value: "Sets the bassboost level of the player",
        },
        { name: "/join", value: "Joins the users voice channel" },
        {
          name: "/stop",
          value: "Clears the queue and disconnects from voice",
        },
        { name: "/loop", value: "Loops current queue/song" },
        { name: "/volume", value: "Sets the volume of the player" }
      );

    const levelEmbed = new EmbedBuilder()
      .setTitle("✨ Leveling")
      .setDescription("Leveling commands")
      .setColor(botColour)
      .addFields(
        { name: "/level", value: "Shows users level and xp" },
        {
          name: "/leaderboard",
          value: "Shows the top 10 users levels in the server",
        },
        { name: "/xp add", value: "Add xp to a user" },
        { name: "/xp remove", value: "Remove xp from a user" },
        { name: "/xp set xp", value: "Set the xp of a user" },
        { name: "/xp set level", value: "Set the level of a user" }
      );

    const modEmbed = new EmbedBuilder()
      .setTitle("🔨 Moderation")
      .setDescription("Moderation commands")
      .setColor(botColour)
      .addFields(
        { name: "/ban", value: "Bans a user" },
        { name: "/unban", value: "Unban a user" },
        { name: "/kick", value: "Kick a user" },
        { name: "/timeout add", value: "Add a timeout to a user" },
        { name: "/timeout remove", value: "Remove a timeout from a user" },
        { name: "/clear", value: "Clears messages from a channel" },
        { name: "/dashboard", value: "Get a link to the server dashboard" }
      );

    const generalEmbed = new EmbedBuilder()
      .setTitle("🖥️ General")
      .setDescription("General commands")
      .setColor(botColour)
      .addFields(
        { name: "/avatar", value: "Shows the avatar of a user" },
        { name: "/info server", value: "Shows server info" },
        { name: "/info user", value: "Shows a users info" },
        { name: "/ping", value: "Returns bot latency" },
        { name: "/reddit", value: "Gets a random post from a subreddit" },
        {
          name: "/invite",
          value: "Get a link to invite the bot to your server",
        }
      );

    const embeds = [
      generalEmbed,
      levelEmbed,
      musicEmbed,
      modEmbed,
      settingsEmbed,
    ];

    let page = 1;

    let row = createRow(embeds.length - 1);

    let message = await interaction.followUp({
      embeds: [embeds[page - 1]],
      components: [row],
    });

    const filter = (i) => i.user.id === interaction.user.id;

    const collector = message.createMessageComponentCollector({
      filter,
      time: "300000",
    });

    collector.on("collect", async (i) => {
      i.deferUpdate();

      switch (i.customId) {
        case "page_forward_single":
          page += 1;

          row = createRow(embeds.length - 1, page);

          message = await interaction.editReply({
            embeds: [embeds[page]],
            components: [row],
          });
          break;
        case "page_forward_whole":
          page = embeds.length;

          row = createRow(embeds.length - 1, page);

          message = await interaction.editReply({
            embeds: [embeds[page - 1]],
            components: [row],
          });
          break;
        case "page_back_single":
          page -= 1;

          row = createRow(embeds.length - 1, page);

          message = await interaction.editReply({
            embeds: [embeds[page]],
            components: [row],
          });
          break;
        case "page_back_whole":
          page = 1;

          row = createRow(embeds.length - 1, page);

          message = await interaction.editReply({
            embeds: [embeds[page - 1]],
            components: [row],
          });
          break;
      }
    });
  },
};
