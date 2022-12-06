const Guild = require(`../schemas/guild`);
const checkUserSchema = require("../checkUserSchema");
const checkGuildSchema = require("../checkGuildSchema");

module.exports = {
  name: "messageReactionAdd",
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
      let reactionRole;
      guildProfile.reactionRoles.forEach((r) => {
        if (r.message == reaction.message.id) {
          for (let [key, value] of guildProfile.reactionRoles.entries()) {
            if (value.message == reaction.message.id) {
              reactionRole = r;
            }
          }
        }
      });

      let emoji = reactionRole.emoji;
      let reactionEmoji;
      if (reaction.emoji.id) {
        reactionEmoji =
          "<:" + reaction.emoji.name + ":" + reaction.emoji.id + ">";
      } else {
        reactionEmoji = reaction.emoji.name;
      }

      const roles = await reaction.message.guild.roles.fetch();
      const role = roles.filter((r) => r.id === `${reactionRole.role}`);
      if (reactionEmoji == emoji) {
        await reaction.message.guild.members.resolve(user.id).roles.add(role);
      }
    } catch (err) {
      console.log(err);
    }
  },
};
