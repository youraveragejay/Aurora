// Require other classes
const { token, databaseToken } = require("./config.js");
const { connect, connection } = require(`mongoose`);
const fs = require("node:fs");
const path = require("node:path");
const { GlobalFonts } = require("@napi-rs/canvas");
GlobalFonts.registerFromPath(
  "./files/fonts/ValleyGrrrlNf-ooKa.ttf",
  "ValleyGrll"
);
GlobalFonts.registerFromPath(
  "./files/fonts/ShadowsOfTheValleyRegularFonty-zLpD.ttf",
  "ValleyShadows"
);
const dotenv = require("dotenv");
dotenv.config();

// Require neccessary discord.js classes
const { Client, GatewayIntentBits, Collection } = require("discord.js");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

//

// Command Handler
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

// Event Handler
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Mongo events
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once)
    connection.once(event.name, (...args) => event.execute(...args, client));
  else connection.on(event.name, (...args) => event.execute(...args, client));
}

// Login to Discord with your client's token
client.login(process.env.TOKEN);

// Connect to mongo
(async () => {
  await connect(databaseToken).catch(console.error);
})();
