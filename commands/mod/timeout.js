const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user stated.")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Removes timeout from a user")
        .addUserOption((option) =>
          option
            .setName(`target`)
            .setDescription(`The user to timeout`)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Adds timeout to a user")
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
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
  async execute(interaction) {
    await interaction.deferReply();
    const user = interaction.options.getUser(`target`);
    const member = await interaction.guild.members
      .fetch(user.id)
      .catch(console.log);

    switch (interaction.options.getSubcommand()) {
      case "add":
        let reason = interaction.options.getString(`reason`);
        if (!reason) reason = `No reason was provided`;
        let time = interaction.options.getInteger(`time`);

        if (member.moderatable) {
          await member.timeout(time * 60 * 1000, reason).catch(console.log);

          await interaction.editReply(
            `<@${user.id}> has been timed out for ${time} minutes`
          );
        } else {
          await interaction.editReply("You cannot timeout this user");
        }
        break;
      case "remove":
        if (member.moderatable) {
          await member.timeout(null).catch(console.log);

          await interaction.editReply(`Timeout removed from <@${user.id}>`);
        } else {
          await interaction.editReply("You cannot untimeout this user");
        }
        break;
    }
  },
};
