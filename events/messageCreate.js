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
    await checkUserSchema(message.member, message);

    let guildProfile = await Guild.findOne({ guildId: message.guild.id });

    const randomXP = Math.floor(Math.random() * 6) + 2;

    guildProfile.levels.set(`${userId}`, {
      level: guildProfile.levels.get(`${userId}`).level,
      xp: guildProfile.levels.get(`${userId}`).xp + randomXP,
    });

    let lvlXp =
      baseXP * guildProfile.levels.get(`${userId}`).level -
      guildProfile.levels.get(`${userId}`).xp;

    if (lvlXp <= 0) {
      guildProfile.levels.set(`${userId}`, {
        level: guildProfile.levels.get(`${userId}`).level + 1,
        xp: 0,
      });
      if (!guildProfile.levelUpChannel) {
        await message.channel.send(
          `<@${userId}> has reached level ${
            guildProfile.levels.get(`${userId}`).level
          }!!`
        );
      } else {
        message.guild.channels.cache
          .get(guildProfile.levelUpChannel)
          .send(
            `<@${userId}> has reached level ${
              guildProfile.levels.get(`${userId}`).level
            }!!`
          )
          .catch((err) => console.log(err));
      }

      await guildProfile.save().catch(console.error);
    } else {
      await guildProfile.save().catch(console.error);
    }
  },
};
