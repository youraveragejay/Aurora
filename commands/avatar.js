const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const { botColour } = require(`../data/config.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Gets the avatar of a user")
    .addUserOption((option) =>
      option.setName(`user`).setDescription(`User's avatar to display`)
    )
    .setDMPermission(false),
  async execute(interaction) {
    if (interaction.options.getUser(`user`)) {
      const avatarUser = interaction.options.getUser(`user`);
      const embed = new EmbedBuilder()
        .setColor(botColour)
        .setTitle(avatarUser.tag)
        .setURL(avatarUser.avatarURL())
        .setImage(avatarUser.displayAvatarURL({ dynamic: true, size: 256 }));
      await interaction.reply({ embeds: [embed] });
    } else {
      const avatarUser = interaction.user;
      //console.log(avatarUser.id);
      const embed = new EmbedBuilder()
        .setColor(botColour)
        .setTitle(avatarUser.tag)
        .setURL(avatarUser.avatarURL())
        .setImage(avatarUser.displayAvatarURL({ dynamic: true, size: 256 }));
      await interaction.reply({ embeds: [embed] });
    }
  },
};
