const Guild = require(`../schemas/guild`);
const checkUserSchema = require("../checkUserSchema");
const checkGuildSchema = require("../checkGuildSchema");
const { baseXP } = require(`../data/config.js`);

module.exports = {
  name: "messageCreate",
  execute: async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const userId = message.member.user.id;
    await checkGuildSchema(message.guild);
    await checkUserSchema(message.guild, message);

    let guildProfile = await Guild.findOne({ guildId: message.guild.id });
    console.log(`Level: ${guildProfile.levels.get(`${userId}`).level}`);

    const randomXP = Math.floor(Math.random() * 4) + 1;

    guildProfile.levels.set(`${userId}`, {
      level: guildProfile.levels.get(`${userId}`).level,
      xp: guildProfile.levels.get(`${userId}`).xp + randomXP,
    });
    console.log(`XP: ${guildProfile.levels.get(`${userId}`).xp}`);

    let lvlXp =
      baseXP * guildProfile.levels.get(`${userId}`).level -
      guildProfile.levels.get(`${userId}`).xp;
    console.log(`XP to next level: ${lvlXp}`);

    if (lvlXp <= 0) {
      guildProfile.levels.set(`${userId}`, {
        level: guildProfile.levels.get(`${userId}`).level + 1,
        xp: 0,
      });

      await message.channel.send(
        `<@${userId}> has reached level ${
          guildProfile.levels.get(`${userId}`).level
        }!!`
      );

      await guildProfile.save().catch(console.error);
    } else {
      await guildProfile.save().catch(console.error);
    }
  },
};
