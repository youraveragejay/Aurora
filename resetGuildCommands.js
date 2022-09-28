const { Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { clientId, guildId, token } = require("./data/config.js");

const rest = new REST({ version: "10" }).setToken(token);

try {
  rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: [],
  });

  console.log("Successfully reset guild commands.");
} catch (error) {
  console.error(error);
}