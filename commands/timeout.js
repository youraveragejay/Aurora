const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user stated.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName(`target`)
        .setDescription(`The user to timeout`)
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName(`time`)
        .setDescription(`The amount of minutes to timeout a member for`)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName(`reason`)
        .setDescription(`The reason for timing out this member`)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const user = interaction.options.getUser(`target`);
    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(console.error);
    let reason = interaction.options.getString(`reason`);
    if (!reason) reason = `No reason was provided`;
    let time = interaction.options.getInteger(`time`);

    await member
      .timeout(time * 60 * 1000, reason)
      .catch(console.error);

    await interaction.reply({
      content: `${user.tag} has been timed out`,
      ephemeral: true,
    });
  },
};
