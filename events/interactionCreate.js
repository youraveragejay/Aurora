const checkUserSchema = require("../checkUserSchema");
const checkGuildSchema = require("../checkGuildSchema");

module.exports = {
  name: "interactionCreate",
  execute: async (interaction) => {
    await checkGuildSchema(interaction.guild);
    await checkUserSchema(interaction.user, interaction);
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.log(error);
      try {
        await interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      } catch (err) {
        console.log(err);
      }
    }
  },
};
