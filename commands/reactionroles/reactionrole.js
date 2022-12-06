const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { botColour } = require("../../data/config");
const Guild = require("../../schemas/guild");
const checkGuildSchema = require("../../checkGuildSchema");
const checkUserSchema = require("../../checkUserSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reactionrole")
    .setDescription("Reaction role command")
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
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel to send the message to")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("emoji")
            .setDescription("Emoji users react with")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`remove`)
        .setDescription("Removes a reaction role")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("ID of the message the reaction roles are tied to")
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setDMPermission(false),
  async execute(interaction) {
    await checkGuildSchema(interaction.guild);
    await checkUserSchema(interaction.member, interaction);

    let subcommand = interaction.options.getSubcommand();

    const role = interaction.options.getRole("role");
    let channel;

    let guildProfile = await Guild.findOne({ guildId: interaction.guild.id });

    let message;
    let reactionRoles;
    let emoji;

    switch (subcommand) {
      case "add":
        emoji = interaction.options.getString("emoji");
        channel = interaction.options.getChannel("channel");

        const embed = new EmbedBuilder()
          .setDescription(`React to this message with ${emoji} to get ${role}`)
          .setColor(botColour);

        reactionRoles = guildProfile.reactionRoles;
        reactionRoles.forEach(async (r) => {
          if (r.role == role.id) {
            return await interaction.reply(
              `You have already created a reactionrole for ${role}`
            );
          }
        });

        await interaction.reply(`Reactionrole Added`);

        message = await channel.send({
          embeds: [embed],
          fetchReply: true,
        });
        message.react(`${emoji}`);

        const randomId =
          Date.now().toString() + Math.floor(Math.random() * 100).toString();

        if (emoji.id) {
          guildProfile.reactionRoles.set(randomId, {
            role: role.id,
            emoji,
            message: message.id,
            channel: channel.id,
            customEmoji: true,
          });
        } else {
          guildProfile.reactionRoles.set(randomId, {
            role: role.id,
            emoji,
            message: message.id,
            channel: channel.id,
            customEmoji: false,
          });
        }

        await guildProfile.save().catch((err) => console.log(err));
        break;
      case "remove":
        const id = interaction.options.getString("id");

        reactionRoles = guildProfile.reactionRoles;
        reactionRoles.forEach(async (r) => {
          if (r.message == id) {
            for (let [key, value] of reactionRoles.entries()) {
              if (value.message == id) {
                channel = interaction.guild.channels.resolve(value.channel);
                message = await channel.messages.fetch(id);

                message.delete();

                guildProfile.reactionRoles.delete(key);
              }
            }
          }
        });

        await interaction.reply("Deleted reaction role.");
        break;
    }
  },
};
