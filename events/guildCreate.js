const checkGuildSchema = require("../checkGuildSchema");

module.exports = {
  name: "guildCreate",
  async execute(guild) {
    await checkGuildSchema(guild);
  },
};
