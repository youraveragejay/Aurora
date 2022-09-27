const Guild = require(`./schemas/guild`);

module.exports = async (guild) => {
  let guildProfile = await Guild.findOne({ guildId: guild.id });
  if (!guildProfile) {
    guildProfile = await new Guild({
      guildId: guild.id,
      levels: new Map([]),
      nsfwmemes: false,
    });

    await guildProfile.save().catch(console.error);
  }
};
