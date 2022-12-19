const checkGuildSchema = require("../checkGuildSchema");
const Guild = require(`../schemas/guild`);

module.exports = {
  name: "guildMemberRemove",
  async execute(member) {
    let guildProfile = await Guild.findOne({ guildId: member.guild.id });
    checkGuildSchema(member.guild);
    if (!guildProfile.has("welcomeChannel")) return;
    member.guild.channels.cache
      .get(guildProfile.welcomeChannel)
      .send(`<@${member.id}> has left.`)
      .catch((err) => console.log(err));
  },
};
