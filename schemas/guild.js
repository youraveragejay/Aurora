const { Schema, model } = require("mongoose");
const { TextChannel } = require("discord.js");

const guildSchema = new Schema({
  guildId: { type: String, required: true },
  welcomeChannel: { type: String, default: "" },
  levels: { type: Map, of: { level: Number, xp: Number }, default: {} },
  nsfwmemes: { type: Boolean, default: false },
  levelUpChannel: { type: String, default: "" },
  reactionRoles: {
    type: Map,
    of: { role: String, emoji: String },
    default: {},
  },
});

module.exports = model("Guild", guildSchema, "guild");
