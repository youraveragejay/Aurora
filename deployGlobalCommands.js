const fs = require("node:fs");
const path = require("node:path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");
const { clientId, guildId, token } = require("./data/config.js");

const commands = [];
const folderPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(folderPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(__dirname, "commands", folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
  }
}
const rest = new REST({ version: "10" }).setToken(token);

rest
  .put(Routes.applicationCommands(clientId), { body: commands })
  .then((data) =>
    console.log(
      `Successfully registered ${data.length} application commands globally.`
    )
  )
  .catch(console.error);

try {
  rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: [],
  });

  console.log("Successfully reset guild commands.");
} catch (error) {
  console.error(error);
}
