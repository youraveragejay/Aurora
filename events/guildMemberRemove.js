const Guild = require(`../schemas/guild`);

module.exports = {
  name: "guildMemberRemove",
  async execute(member) {
    let guildProfile = await Guild.findOne({ guildId: member.guild.id });
    if (!guildProfile.welcomeChannel) return;
    member.guild.channels.cache
      .get(guildProfile.welcomeChannel)
      .send(`<@${member.id}> has left.`)
      .catch((err) => console.log(err));
  },
};
