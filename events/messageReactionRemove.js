const Guild = require(`../schemas/guild`);
const checkUserSchema = require("../checkUserSchema");
const checkGuildSchema = require("../checkGuildSchema");

module.exports = {
  name: "messageReactionRemove",
  async execute(reaction, user) {
    if (user.bot) return;
    if (!reaction.message.guild) return;

    try {
      reaction = await reaction.fetch();
      user = await user.fetch();
    } catch (err) {
      console.log(err);
    }

    checkGuildSchema(reaction.message.guild);
    checkUserSchema(user, reaction.message);

    const guildProfile = await Guild.findOne({
      guildId: reaction.message.guild.id,
    });

    try {
      const reactionRole = guildProfile.reactionRoles.get(
        `${reaction.message.id}`
      );
      const emoji = reactionRole.emoji;
      const roles = await reaction.message.guild.roles.fetch();
      const role = roles.filter((r) => r.name === `${reactionRole.role}`);
      if (reaction.emoji.name == emoji) {
        await reaction.message.guild.members
          .resolve(user.id)
          .roles.remove(role);
      }
    } catch (err) {
      console.log(err);
    }
  },
};
