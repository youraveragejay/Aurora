const checkGuildSchema = require("../checkGuildSchema");
const Guild = require(`../schemas/guild`);

module.exports = {
  name: "guildMemberRemove",
  async execute(member) {
    checkGuildSchema(member.guild);
    let guildProfile = await Guild.findOne({ guildId: member.guild.id });

    if (guildProfile.welcomeChannel === null) return;

    member.guild.channels.cache
      .get(guildProfile.welcomeChannel)
      .send(`<@${member.id}> has left.`)
      .catch((err) => console.log(err));
  },
};
