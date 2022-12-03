const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { botColour } = require("../../data/config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dashboard")
    .setDescription("Get a link to the server dashboard"),
  async execute(interaction) {
    const inviteLink = `https://youraveragejay.netlify.app/aurora/dashboard/${interaction.guild.id}`;
    const embed = new EmbedBuilder()
      .setDescription(
        `Configure ${interaction.guild.name}'s settings [here](${inviteLink})`
      )
      .setColor(botColour);
    await interaction.reply({ embeds: [embed] });
  },
};
