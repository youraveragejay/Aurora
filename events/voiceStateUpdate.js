
module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState) {
    if (!newState.channelId) {
      const player = newState.client.manager.get(newState.guild.id);
      if (!player) return;

      player.destroy();
    };
  },
};
