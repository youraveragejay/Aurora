const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { botColour } = require("../data/config");
const Guild = require("../schemas/guild");

const findMinInArray = (array) => {
  const min = Math.min(array);
  console.log(min);
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View the top 10 users in the server.")
    .setDMPermission(false),
  async execute(interaction) {
    const guildProfile = await Guild.findOne({ guildId: interaction.guild.id });
    const guild = interaction.guild;

    if (!guildProfile) {
      await interaction.reply("Unknown guild: " + interaction.guild.name);
    }

    const leaderboard = {};
    guildProfile.levels.forEach((val, userId) => {
      //const user = guild.members.cache.get(key).user;
      //const username = user.username;
      const level = val.level;
      leaderboard[userId] = level;
    });

    if (leaderboard.length < 0)
      await interaction.reply({ content: "Error", ephemeral: true });

    const users = Object.keys(leaderboard).map((key) => {
      return [key, leaderboard[key]];
    });
    users.sort((first, second) => {
      return second[1] - first[1];
    });
    users.slice(0, 10);

    let message = ``;
    let index = 0;

    for (var user of users) {
      const id = user[0];
      const level = user[1];
      
        const member= await interaction.guild.members.fetch(id);
        if(!member) { message += ""} else{
        index = index + 1;
        message += `**${index}**. <@${id}>, ***Level: ${level}***\n`;}

    }

    const embed = new EmbedBuilder().setColor(botColour).addFields({
      name: `Leaderboard for ${interaction.guild.name}`,
      value: `${message}`,
    });

    await interaction.reply({ embeds: [embed] });
  },
};
