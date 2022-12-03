// Node Modules
const path = require("node:path");
const fs = require("node:fs");

// Data
const { token, databaseToken, botColour } = require("./data/config.js");
require("dotenv").config();

// Require other classes
const { connect, connection } = require(`mongoose`);
const { Manager } = require("erela.js");
const Spotify = require("erela.js-spotify");

// Fonts
const { GlobalFonts } = require("@napi-rs/canvas");
GlobalFonts.registerFromPath(
  "./files/fonts/ValleyGrrrlNf-ooKa.ttf",
  "ValleyGrll"
);
GlobalFonts.registerFromPath(
  "./files/fonts/ShadowsOfTheValleyRegularFonty-zLpD.ttf",
  "ValleyShadows"
);

// Require neccessary Discord.js classes
const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials,
  EmbedBuilder,
} = require("discord.js");

// Create a new client instance
const client = new Client({
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User,
  ],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

// Erela
const clientID = process.env.SP_CLIENT_ID;
const clientSecret = process.env.SP_CLIENT_SECRET;

// Define some options for the node
const nodes = [
  {
    host: "localhost",
    password: "youshallnotpass",
    port: 2333,
  },
];
client.manager = new Manager({
  // The nodes to connect to, optional if using default lavalink options
  nodes,
  plugins: [
    // Initiate the plugin and pass the two required options.
    new Spotify({
      clientID,
      clientSecret,
    }),
  ],
  // Method to send voice data to Discord
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    // NOTE: FOR ERIS YOU NEED JSON.stringify() THE PAYLOAD
    if (guild) guild.shard.send(payload);
  },
})
  .on("trackStart", (player, track) => {
    const channel = client.channels.cache.get(player.textChannel);
    // Send a message when the track starts playing with the track name and the requester's Discord tag, e.g. username#discriminator
    const embed = new EmbedBuilder()
      .setDescription(
        `**Now playing**: \`${track.title}\`, \nRequested by <@${track.requester.id}>.`
      )
      .setColor(botColour);

    channel.send({ embeds: [embed] });
  })
  .on("queueEnd", (player) => {
    const channel = client.channels.cache.get(player.textChannel);
    channel.send("Queue has ended.");
    player.destroy();
  });

// Command Handler
client.commands = new Collection();
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
    // Set a new item in the Collection
    // With the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
  }
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

// Erela Events
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.manager.once(event.name, (...args) => event.execute(...args));
  } else {
    client.manager.on(event.name, (...args) => event.execute(...args));
  }
}
// THIS IS REQUIRED. Send raw events to Erela.js
client.on("raw", (d) => client.manager.updateVoiceState(d));

// Mongo events
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once)
    connection.once(event.name, (...args) => event.execute(...args, client));
  else connection.on(event.name, (...args) => event.execute(...args, client));
}

// Login to Discord with your client's token
client.login(token);

// Connect to mongo
(async () => {
  await connect(databaseToken).catch(console.error);
})();
