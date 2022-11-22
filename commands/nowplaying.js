const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { botColour } = require("../data/config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Displays current track")
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.deferReply();
    const queue = interaction.client.player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return await interaction.editReply("There are no songs in the queue");
    }




    const currentSong = queue.current;

    const embed = new EmbedBuilder()
      .setDescription(
        `**Currently Playing**\n` +
          (currentSong
            ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>`
            : "None") 
          
      )
      .setThumbnail(currentSong.thumbnail).setColor(botColour);

    await interaction.editReply({ embeds: [embed] });
  },
};
