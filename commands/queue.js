const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { botColour } = require("../data/config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Displays current queue")
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.deferReply();
    const queue = interaction.client.player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return await interaction.editReply("There are no songs in the queue");
    }

    const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
    const page = 1 - 1;

    const queueString = queue.tracks
      .slice(page * 10, page * 10 + 10)
      .map((song, i) => {
        return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${
          song.title
        } -- <@${song.requestedBy.id}>`;
      })
      .join("\n");

    const currentSong = queue.current;

    const embed = new EmbedBuilder()
      .setDescription(
        `**Currently Playing**\n` +
          (currentSong
            ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>`
            : "None") +
          `\n\n**Queue**\n${queueString}`
      )
      .setFooter({
        text: `Page ${page + 1} of ${totalPages}`,
      })
      .setThumbnail(currentSong.thumbnail).setColor(botColour);

    await interaction.editReply({ embeds: [embed] });
  },
};
