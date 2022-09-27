const { Schema, model } = require("mongoose");
const guildSchema = new Schema({
  guildId: { type: String, required: true },
  welcomeChannel: { type: String, default: "" },
  levels: { type: Map, of: { level: Number, xp: Number }, default: {} },
  nsfwmemes: { type: Boolean, default: false },
});

module.exports = model("Guild", guildSchema, "guild");
