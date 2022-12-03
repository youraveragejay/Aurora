const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans a user stated.")
    .setDMPermission(false)
    .addUserOption((option) =>
      option
        .setName(`target`)
        .setDescription(`The user to ban`)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName(`reason`)
        .setDescription(`The reason for banning this member`)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    const user = interaction.options.getUser(`target`);
    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(console.error);
    let reason = interaction.options.getString(`reason`);
    if (!reason) reason = `No reason was provided`;

    if (!member.bannable) return;

    await member
      .ban({
        deleteMessageDays: 7,
        reason: reason,
      })
      .catch(console.error);

    await interaction.reply({
      content: `${user.tag} has been banned`,
      ephemeral: true,
    });
  },
};
