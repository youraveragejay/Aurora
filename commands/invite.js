const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Get a link to invite me to a server"),
  async execute(interaction) {
    const inviteLink =
      "https://youraveragejay.netlify.app/aurora/invite";
    await interaction.reply(`You can invite me from <${inviteLink}>`);
  },
};
