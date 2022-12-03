const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks a user stated.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName(`target`)
        .setDescription(`The user to kick`)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName(`reason`)
        .setDescription(`The reason for kicking this member`)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const user = interaction.options.getUser(`target`);
    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(console.error);
    let reason = interaction.options.getString(`reason`);
    if (!reason) reason = `No reason was provided`;

    if (!member.kickable) return;

    await member.kick(reason).catch(console.error);

    await interaction.reply({
      content: `${user.tag} has been kicked`,
      ephemeral: true,
    });
  },
};
