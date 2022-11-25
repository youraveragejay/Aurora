const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    client.manager.init(client.user.id);
    client.user.setPresence({
      activities: [{ name: "/meme", type: ActivityType.Watching }],
      status: "idle",
    });
  },
};
