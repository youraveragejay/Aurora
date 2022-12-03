const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { botColour } = require("../../data/config");
const Guild = require("../../schemas/guild");
const checkGuildSchema = require("../../checkGuildSchema");
const checkUserSchema = require("../../checkUserSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reactionrole")
    .setDescription("Reaction role")
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`add`)
        .setDescription("Creates a reaction role")
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Role to assign to users")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("emoji")
            .setDescription("Emoji users react with")
            .setRequired(true)
        )
    )
    .setDMPermission(false),
  async execute(interaction) {
    await checkGuildSchema(interaction.guild);
    await checkUserSchema(interaction.member, interaction);

    let guildProfile = await Guild.findOne({ guildId: interaction.guild.id });

    const role = interaction.options.getRole("role");
    const emoji = interaction.options.getString("emoji");

    const embed = new EmbedBuilder()
      .setDescription(`React to this message with ${emoji} to get ${role}`)
      .setColor(botColour);

    const message = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
    });
    message.react(`${emoji}`);

    try {
      guildProfile.reactionRoles.set(`${message.id}`, {
        role: `${role.name}`,
        emoji: `${emoji}`,
      });
    } catch (err) {
      console.log(err);
    }

    await guildProfile.save().catch((err) => console.log(err));
  },
};
