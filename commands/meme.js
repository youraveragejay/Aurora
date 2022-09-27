const { SlashCommandBuilder } = require("discord.js");
const RedditImageFetcher = require("reddit-image-fetcher");
const { EmbedBuilder } = require("discord.js");
const { botColour } = require(`../config.js`);
const Guild = require(`../schemas/guild`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Sends a meme using Reddit API")
    .addStringOption((option) =>
      option
        .setName(`subreddit`)
        .setDescription(`Subreddit to filter through`)
        .setRequired(true)
    )
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.deferReply();
    let guildProfile = await Guild.findOne({ guildId: interaction.guild.id });
    if (!guildProfile) checkGuildSchema();
    RedditImageFetcher.fetch({
      type: "custom",
      total: 50,
      subreddit: [interaction.options.getString(`subreddit`)],
    }).then(async (result) => {
      const randNum = Math.floor(Math.random() * result.length);
      if (!result[randNum])
        return await interaction.reply({
          content: `This does not exist.`,
          ephemeral: true,
        });
      if (
        !guildProfile.nsfwmemes &&
        result[randNum].NSFW &&
        !interaction.channel.nsfw
      ) {
        await interaction.followUp(`No NSFW images allowed.`);
        return;
      } else {
        const embed = new EmbedBuilder()
          .setColor(botColour)
          .addFields({
            name: `Subreddit: ${result[randNum].subreddit}`,
            value: result[randNum].title,
          })
          .setImage(result[randNum].image)
          .setTimestamp();

        await interaction.followUp({ embeds: [embed] });
      }
    });
  },
};
