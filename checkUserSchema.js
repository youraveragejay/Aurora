const Guild = require(`./schemas/guild`);

module.exports = async (user, interaction) => {
  let guildProfile = await Guild.findOne({ guildId: interaction.guild.id });
  if (!guildProfile.levels.get(user.id)) {
    guildProfile.levels.set(`${user.id}`, { "level": 0, "xp": 0 });

    await guildProfile.save().catch(console.error);
  }
};