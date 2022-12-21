const Guild = require(`./schemas/guild`);

module.exports = async (guild) => {
  let guildProfile = await Guild.findOne({ guildId: guild.id });
  if (!guildProfile) {
    guildProfile = await new Guild({
      guildId: guild.id,
      levels: new Map([]),
      nsfwmemes: false,
      welcomeChannel: guild.systemChannel.id,
      levelUpChannel: guild.systemChannel.id,
      reactionRoles: new Map([]),
    });

    await guildProfile.save().catch(console.log);
  }
  try {
    guildProfile.welcomeChannel;
  } catch (e) {
    guildProfile.welcomeChannel = guild.systemChannel.id;
  }

  try {
    guildProfile.levelUpChannel;
  } catch (e) {
    guildProfile.levelUpChannel = guild.systemChannel.id;
  }
};
