const {SystemChannelFlagsBitField} = require("discord.js");

module.exports = async (guild) => {
   guild.setSystemChannelFlags(SystemChannelFlagsBitField.Flags.SuppressJoinNotifications)
};
