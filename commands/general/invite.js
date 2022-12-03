const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { botColour } = require("../data/config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Get a link to invite me to a server"),
  async execute(interaction) {
    const inviteLink =
      "https://youraveragejay.netlify.app/aurora/invite";
    const embed = new EmbedBuilder()
      .setColor(botColour)
      .setDescription(
        `You can invite me by visiting [youraveragejay.netlify.app/aurora/invite](<${inviteLink}>)`
      );
    await interaction.reply({ embeds: [embed] });
  },
};
