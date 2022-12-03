const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const { botColour } = require("../../data/config");

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
      .setColor(botColour);

    const musicEmbed = new EmbedBuilder()
      .setTitle("🎶 Music")
      .setDescription("Music commands")
      .setColor(botColour);

    const levelEmbed = new EmbedBuilder()
      .setTitle("✨ Leveling")
      .setDescription("Leveling commands")
      .setColor(botColour);

    const modEmbed = new EmbedBuilder()
      .setTitle("🔨 Moderation")
      .setDescription("Moderation commands")
      .setColor(botColour);

    const generalEmbed = new EmbedBuilder()
      .setTitle("🖥️ General")
      .setDescription("General commands")
      .setColor(botColour);

    const reactionRoleEmbed = new EmbedBuilder()
      .setTitle("😜 Reaction Roles")
      .setDescription("Reaction role commands")
      .setColor(botColour);

    const embeds = [
      generalEmbed,
      levelEmbed,
      musicEmbed,
      reactionRoleEmbed,
      modEmbed,
      settingsEmbed,
    ];

    const folderPath = path.join(__dirname, "../../commands");
    const commandFolders = fs.readdirSync(folderPath);

    let index;

    for (const folder of commandFolders) {
      const commandsPath = path.join(__dirname, "../", folder);
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));

      for (e in embeds) {
        let prop = embeds[e];
        e = prop;

        if (e.data.title.toLowerCase().replace(/\s+/g, "").includes(folder)) {
          index = embeds.indexOf(e);

          const embed = embeds[index];
          for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);

            if (
              command.data.options.length != 0 &&
              command.data.options[0].options
            ) {
              for (opt in command.data.options) {
                const subcmds = command.data.options;

                const subcmd = subcmds[opt];

                embed.addFields({
                  name: "/" + command.data.name + " " + subcmd.name,
                  value: subcmd.description,
                });
              }
            } else {
              embed.addFields({
                name: "/" + command.data.name,
                value: command.data.description,
              });
            }
          }
        }
      }
    }

    let page = 1;

    let row = createRow(embeds.length);

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

          row = createRow(embeds.length, page);

          message = await interaction.editReply({
            embeds: [embeds[page - 1]],
            components: [row],
          });
          break;
        case "page_forward_whole":
          page = embeds.length;

          row = createRow(embeds.length, page);

          message = await interaction.editReply({
            embeds: [embeds[page - 1]],
            components: [row],
          });
          break;
        case "page_back_single":
          page -= 1;

          row = createRow(embeds.length, page);

          message = await interaction.editReply({
            embeds: [embeds[page - 1]],
            components: [row],
          });
          break;
        case "page_back_whole":
          page = 1;

          row = createRow(embeds.length, page);

          message = await interaction.editReply({
            embeds: [embeds[page - 1]],
            components: [row],
          });
          break;
      }
    });
  },
};
