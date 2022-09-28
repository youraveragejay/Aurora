const Guild = require(`./schemas/guild`);

module.exports = async (user, m) => {
  let guildProfile = await Guild.findOne({ guildId: m.guild.id });
  if (!guildProfile.levels.get(user.id)) {
    guildProfile.levels.set(`${user.id}`, { level: 1, xp: 0 });

    await guildProfile.save().catch(console.error);
  }
};
