
module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState) {
    if (oldState.id === 977647458677035008){
      if (!newState.channelId) {
      const player = newState.client.manager.get(newState.guild.id);
      if (!player) return;

      player.destroy();
      };
    } 
  },
};
