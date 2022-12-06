const Guild = require(`./schemas/guild`);
const checkGuildSchema = require("./checkGuildSchema");

module.exports = async (message) => {
  let guildProfile = await Guild.findOne({ guildId: message.guild.id });
  if (!guildProfile) {
    await checkGuildSchema(message.guild);
  }
  const reactionRoles = guildProfile.reactionRoles;
  reactionRoles.forEach((role) => {
    if (role.message == message.id) {
      for (let [key, value] of reactionRoles.entries()) {
        if (value.message == message.id) {
          guildProfile.reactionRoles.delete(key);
        }
      }
    }
  });
  await guildProfile.save().catch(console.log());
};
