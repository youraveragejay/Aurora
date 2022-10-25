const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Deletes a certain amount of messages.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addIntegerOption((option) =>
      option
        .setName(`amount`)
        .setDescription(`Amount of messages to delete`)
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const amount = interaction.options.getInteger(`amount`);
    const channel = interaction.channel;

    channel.bulkDelete(amount, true);
    interaction.followUp(`Deleted ${amount} messages.`)
  },
};
