const Guild = require(`../schemas/guild`);
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const checkGuildSchema = require(`../checkGuildSchema`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Set server settings")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`welcomechannel`)
        .setDescription(`Set the welcome channel.`)
        .addChannelOption((option) =>
          option
            .setName(`channel`)
            .setDescription(`Channel to send welcome messages to.`)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`levelupchannel`)
        .setDescription(`Set the channel for level up messages.`)
        .addChannelOption((option) =>
          option
            .setName(`channel`)
            .setDescription(`Channel to send level up messages to.`)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName(`shownsfwmemes`)
        .setDescription(`Set the option to show NSFW memes (default is false).`)
        .addBooleanOption((option) =>
          option.setName(`set`).setDescription(`True/false.`).setRequired(true)
        )
    ),
  async execute(interaction) {
    let guildProfile;
    await interaction.deferReply();
    switch (interaction.options.getSubcommand()) {
      case `welcomechannel`:
        const welcomeChannel = interaction.options.getChannel(`channel`);
        await interaction.followUp({
          content: `Welcome channel set to ${welcomeChannel}`,
        });
        guildProfile = await Guild.findOne({
          guildId: interaction.guild.id,
        });
        if (!guildProfile) await checkGuildSchema();
        guildProfile.welcomeChannel = welcomeChannel.id;

        await guildProfile.save().catch(console.log);
        break;
      case `shownsfwmemes`:
        const res = interaction.options.getBoolean(`set`);
        await interaction.followUp({
          content: `Show NSFW Memes set to ${res}`,
        });
        guildProfile = await Guild.findOne({ guildId: interaction.guild.id });
        if (!guildProfile) await checkGuildSchema();
        guildProfile.nsfwmemes = res;

        await guildProfile.save().catch(console.log);
        break;
      case `levelupchannel`:
        const levelUpChannel = interaction.options.getChannel(`channel`);

        guildProfile = await Guild.findOne({
          guildId: interaction.guild.id,
        });
        if (!guildProfile) await checkGuildSchema();
        guildProfile.levelUpChannel = levelUpChannel.id;

        await interaction.followUp({
          content: `Level up channel set to ${levelUpChannel}`,
        });

        await guildProfile.save().catch(console.log);
        break;
    }
  },
};
