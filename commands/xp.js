const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Guild = require(`../schemas/guild`);
const checkUserSchema = require("../checkUserSchema");
const checkGuildSchema = require("../checkGuildSchema");
const { baseXP } = require(`../data/config.js`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("xp")
    .setDescription("Manually set user to a specific xp or level value")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`add`)
        .setDescription(`Add xp to specified user`)
        .addUserOption((option) =>
          option
            .setName(`member`)
            .setDescription(`Target Member`)
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName(`xp`)
            .setDescription(`The amount of xp to add`)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`remove`)
        .setDescription(`Remove xp from specified user`)
        .addUserOption((option) =>
          option
            .setName(`member`)
            .setDescription(`Target Member`)
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName(`xp`)
            .setDescription(`The amount of xp to remove`)
            .setRequired(true)
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName(`set`)
        .setDescription(`Set user XP or level`)
        .addSubcommand((subcommand) =>
          subcommand
            .setName(`level`)
            .setDescription(`Set user level`)
            .addUserOption((option) =>
              option
                .setName(`member`)
                .setDescription(`Target Member`)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName(`level`)
                .setDescription(`The level to set to`)
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName(`xp`)
            .setDescription(`Set user XP`)
            .addUserOption((option) =>
              option
                .setName(`member`)
                .setDescription(`Target Member`)
                .setRequired(true)
            )
            .addIntegerOption((option) =>
              option
                .setName(`xp`)
                .setDescription(`The amount of XP to set`)
                .setRequired(true)
            )
        )
    )

    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    await checkGuildSchema(interaction.guild);
    await checkUserSchema(interaction.member, interaction);

    let guildProfile = await Guild.findOne({ guildId: interaction.guild.id });

    await interaction.deferReply();

    const userId = interaction.options.getUser(`member`).id;

    let lvlXp = baseXP * guildProfile.levels.get(`${userId}`).level;

    let newXp;
    let newLvl;

    switch (interaction.options.getSubcommand()) {
      case `add`:
        newXp =
          guildProfile.levels.get(`${userId}`).xp +
          interaction.options.getInteger(`xp`);

        if (newXp > lvlXp) {
          await interaction.followUp(
            `**This value is too high. Level ${
              guildProfile.levels.get(`${userId}`).level
            } can have a maximum xp of** ${lvlXp}`
          );
        } else {
          guildProfile.levels.set(`${userId}`, {
            level: guildProfile.levels.get(`${userId}`).level,
            xp: newXp,
          });
          interaction.followUp(
            `Added ${interaction.options.getInteger("xp")} to ${
              interaction.options.getUser("member").username
            }#${interaction.options.getUser("member").discriminator}`
          );
        }
        break;
      case `remove`:
        newXp =
          guildProfile.levels.get(`${userId}`).xp -
          interaction.options.getInteger(`xp`);

        if (newXp < 0) {
          await interaction.followUp(`**XP cannot be negative**`);
        } else {
          guildProfile.levels.set(`${userId}`, {
            level: guildProfile.levels.get(`${userId}`).level,
            xp: newXp,
          });

          interaction.followUp(
            `Removed ${interaction.options.getInteger("xp")} from ${
              interaction.options.getUser("member").username
            }#${interaction.options.getUser("member").discriminator}`
          );
        }
        break;
      case `xp`:
        newXp = interaction.options.getInteger(`xp`);

        if (newXp > lvlXp) {
          await interaction.followUp(
            `**This value is too high. Level ${
              guildProfile.levels.get(`${userId}`).level
            } can have a maximum xp of** ${lvlXp}`
          );
        } else {
          guildProfile.levels.set(`${userId}`, {
            level: guildProfile.levels.get(`${userId}`).level,
            xp: newXp,
          });
          interaction.followUp(
            `Set ${interaction.options.getUser("member").username}#${
              interaction.options.getUser("member").discriminator
            }'s XP to ${interaction.options.getInteger("xp")}`
          );
        }
        break;
      case `level`:
        newLvl = interaction.options.getInteger(`level`);

        if (newXp > 100) {
          await interaction.followUp(
            `**This value is too high. You cannot set level above 100`
          );
        } else {
          guildProfile.levels.set(`${userId}`, {
            level: newLvl,
            xp: guildProfile.levels.get(`${userId}`).xp,
          });
          interaction.followUp(
            `Set ${interaction.options.getUser("member").username}#${
              interaction.options.getUser("member").discriminator
            }'s level to ${interaction.options.getInteger("level")}`
          );
        }
        break;
    }
    await guildProfile.save().catch((err) => console.log(err));
  },
};
