const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Suggest an idea for the bot")
    .addStringOption((option) =>
      option
        .setName("suggestion")
        .setDescription("The feature you want to suggest")
        .setRequired(true)
    )
    .setDMPermission(false),
  async execute(interaction) {
    const suggestion = interaction.options.getString("suggestion");

    const me = await interaction.guild.members.fetch("690612912024453282");

    const embed = new EmbedBuilder()
      .setAuthor({
        name: interaction.client.user.username,
        iconURL: interaction.client.user.avatarURL(),
      })
      .setThumbnail(interaction.user.avatarURL())
      .addFields(
        { name: "Suggested by:", value: interaction.user.tag },
        { name: "Suggestion:", value: suggestion }
      );

    await me.send({ embeds: [embed] });
    await interaction.reply({
      content: "Registered suggestion!",
      ephemeral: true,
    });
  },
};
