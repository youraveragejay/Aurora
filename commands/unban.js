const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unbans a user stated.")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName(`target`)
        .setDescription(`The user to unban`)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const userID = interaction.options.getString(`target`);
    await interaction.guild.bans
      .fetch()
      .then(async (bans) => {
        if (bans.size == 0)
          return await interaction.reply({
            content: `There are no bans on this server`,
            ephemeral: true,
          });
        let bannedID = bans.find((ban) => (ban.user.id = userID));
        if (!bannedID)
          return await interaction.reply({
            content: `The ID stated is not banned`,
            ephemeral: true,
          });
        await interaction.guild.bans.remove(userID).catch(console.error);
        await interaction.reply({
          content: `${userID} has been unbanned`,
          ephemeral: true,
        });
      })
      .catch(console.error);
  },
};
