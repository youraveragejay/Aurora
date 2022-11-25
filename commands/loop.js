const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Loops player")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Song or Queue")
        .addChoices(
          { name: "SONG", value: "song" },
          { name: "QUEUE", value: "queue" }
        )
    )
    .setDMPermission(false),
  async execute(interaction) {
    await interaction.deferReply();

    const player = interaction.client.manager.get(interaction.guild.id);
    if (!player)
      return await interaction.editReply("there is no player for this guild.");

    const { channel } = interaction.member.voice;

    if (!channel)
      return await interaction.editReply("you need to join a voice channel.");
    if (channel.id !== player.voiceChannel)
      return await interaction.editReply(
        "you're not in the same voice channel."
      );

    if (interaction.options.getString("type") === "queue") {
      player.setQueueRepeat(!player.queueRepeat);
      const queueRepeat = player.queueRepeat ? "enabled" : "disabled";
      return await interaction.editReply(`${queueRepeat} queue repeat.`);
    } else if (interaction.options.getString("type") === "song") {
      player.setTrackRepeat(!player.trackRepeat);
      const trackRepeat = player.trackRepeat ? "enabled" : "disabled";
      return await interaction.editReply(`${trackRepeat} track repeat.`);
    } else {
      return await interaction.editReply("not a valid repeat type");
    }
  },
};
