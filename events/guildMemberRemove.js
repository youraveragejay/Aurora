const Guild = require(`../schemas/guild`);

module.exports = {
  name: "guildMemberRemove",
  async execute(member) {
    let guildProfile = await Guild.findOne({ guildId: member.guild.id });
    try {
      let channel = guildProfile.welcomeChannel;
    } catch (err) {
      console.log(err);
      return;
    }
    member.guild.channels.cache
      .get(guildProfile.welcomeChannel)
      .send(`<@${member.id}> has left.`)
      .catch((err) => console.log(err));
  },
};
