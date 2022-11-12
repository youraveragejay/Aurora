const Guild = require(`./schemas/guild`);

module.exports = async (guild) => {
  let guildProfile = await Guild.findOne({ guildId: guild.id });
  if (!guildProfile) {
    guildProfile = await new Guild({
      guildId: guild.id,
      levels: new Map([]),
      nsfwmemes: false,
      welcomeChannel: guild.systemChannel,
      levelUpChannel: guild.systemChannel,
      reactionRoles: new Map([]),
    });

    await guildProfile.save().catch(console.error);
  }
  if (!guildProfile.get("welcomeChannel")) {
    guildProfile.welcomeChannel = guild.systemChannel;
  }
};
