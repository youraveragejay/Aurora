const Guild = require(`../schemas/guild`);
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const checkGuildSchema = require(`../checkGuildSchema`)

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
        .setName(`shownsfwmemes`)
        .setDescription(`Set the option to show NSFW memes (default is false).`) 
        .addBooleanOption((option) =>
          option.setName(`set`).setDescription(`True/false.`).setRequired(true)
        )
    ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === `welcomechannel`) {
      const welcomeChannel = interaction.options.getChannel(`channel`);
      await interaction.reply({
        content: `Welcome channel set to ${welcomeChannel}`,
      });
      let guildProfile = await Guild.findOne({ guildId: interaction.guild.id });
      if (!guildProfile) await checkGuildSchema();
      guildProfile.welcomeChannel = welcomeChannel.id;

      await guildProfile.save().catch(console.error);
    } else if (interaction.options.getSubcommand() === `shownsfwmemes`) {
      const res = interaction.options.getBoolean(`set`);
      await interaction.reply({ content: `Show NSFW Memes set to ${res}` });
      let guildProfile = await Guild.findOne({ guildId: interaction.guild.id });
      if (!guildProfile) await checkGuildSchema();
      guildProfile.nsfwmemes = res;

      await guildProfile.save().catch(console.error);
    }
  },
};
