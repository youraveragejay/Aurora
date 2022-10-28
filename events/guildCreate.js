const checkGuildSchema = require("../checkGuildSchema");
const checkGuildSettings = require ("../checkGuildSettings")

module.exports = {
  name: "guildCreate",
  async execute(guild) {
    await checkGuildSchema(guild);
    await checkGuildSettings(guild);
  },
};
