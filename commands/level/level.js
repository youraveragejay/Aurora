const { AttachmentBuilder } = require(`discord.js`);
const Canvas = require("@napi-rs/canvas");
const { request } = require("undici");
const { SlashCommandBuilder } = require("discord.js");
const Guild = require(`../../schemas/guild`);
const { baseXP } = require(`../../data/config.js`);

const applyText = (canvas, text) => {
  const context = canvas.getContext("2d");

  // Declare a base size of the font
  let fontSize = 70;

  do {
    // Assign the font to the context and decrement it so it can be measured again
    context.font = `${(fontSize -= 5)}px ValleyGrll`;
    // Compare pixel width of the text to the canvas minus the approximate avatar size
  } while (context.measureText(text).width > canvas.width - 300);

  // Return the result to use in the actual canvas
  return context.font;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Shows a certain users level.")
    .addUserOption((option) =>
      option.setName(`user`).setDescription(`User's level to show`)
    )
    .setDMPermission(false),
  async execute(interaction) {
    if (interaction.options.getUser(`user`)) {
      let user = interaction.options.getUser(`user`);
      let guildProfile = await Guild.findOne({ guildId: interaction.guild.id });
      let userXp = guildProfile.levels.get(`${user.id}`).xp;
      let userLvl = guildProfile.levels.get(`${user.id}`).level;
      let lvlXp = baseXP * userLvl;
      const percentage = Math.floor((userXp / lvlXp) * 100);
      const roundedPercent = Math.round(percentage);
      if (lvlXp > 1000) {
        lvlXp = `${lvlXp / 1000}K`;
      }
      if (userXp > 1000) {
        userXp = `${Math.floor(userXp / 1000)}K`;
      }
      if (userLvl > 1000) {
        userLvl = `${userLvl / 1000}K`;
      }

      const canvas = Canvas.createCanvas(700, 250);
      const context = canvas.getContext("2d");
      const background = await Canvas.loadImage("./files/lvlbackground.png");

      // This uses the canvas dimensions to stretch the image onto the entire canvas
      context.drawImage(background, 0, 0, canvas.width, canvas.height);

      context.font = applyText(canvas, user.tag);

      // Select the style that will be used to fill the text in
      context.fillStyle = "#ffffff";

      // Actually fill the text with a solid color
      context.fillText(user.tag, canvas.width / 2.5, canvas.height / 2.5);

      // Slightly smaller text placed above the member's display name
      context.font = "28px ValleyShadows";
      context.fillStyle = "#ffffff";
      context.fillText(
        `Level: ${userLvl} XP: ${userXp}/${lvlXp}`,
        canvas.width / 2.5,
        canvas.height / 1.8
      );

      // Horizontal line
      context.strokeStyle = `#ffffff`;
      context.lineWidth = 5;

      context.beginPath();
      context.moveTo(280, 110);
      context.lineTo(620, 110);
      context.stroke();

      // Draw BG Part
      for (let i = 0; i < 100; i++) {
        context.beginPath();
        context.lineWidth = 14;
        context.strokeStyle = `#ffffff`;
        context.fillStyle = `#ffffff`;
        context.arc(270 + i * 3.8, 190, 8, 0, Math.PI * 2, true);
        context.stroke();
        context.fill();
      }

      // Draw Level Part
      for (let i = 0; i < roundedPercent; i++) {
        context.beginPath();
        context.lineWidth = 14;
        context.strokeStyle = `#4f729d`;
        context.fillStyle = `#4f729d`;
        context.arc(270 + i * 3.8, 190, 8, 0, Math.PI * 2, true);
        context.stroke();
        context.fill();
      }

      // Pick up the pen
      context.beginPath();

      // Start the arc to form a circle
      context.arc(125, 125, 100, 0, Math.PI * 2, true);

      // Put the pen down
      context.closePath();

      // Clip off the region you drew on
      context.clip();

      // Using undici to make HTTP requests for better performance
      const { body } = await request(
        user.displayAvatarURL({ extension: "png" })
      );
      const avatar = await Canvas.loadImage(await body.arrayBuffer());

      // Draw a shape onto the main canvas
      context.drawImage(avatar, 25, 25, 200, 200);

      // Use the helpful Attachment class structure to process the file for you
      const attachment = new AttachmentBuilder(await canvas.encode("png"), {
        name: "profile-image.png",
      });
      interaction.reply({ files: [attachment] });
    } else {
      let user = interaction.user;
      let guildProfile = await Guild.findOne({ guildId: interaction.guild.id });
      let userXp = guildProfile.levels.get(`${user.id}`).xp;
      let userLvl = guildProfile.levels.get(`${user.id}`).level;
      let lvlXp = baseXP * userLvl;
      const percentage = Math.floor((userXp / lvlXp) * 100);
      const roundedPercent = Math.round(percentage);
      if (lvlXp > 1000) {
        lvlXp = `${lvlXp / 1000}K`;
      }
      if (userXp > 1000) {
        userXp = `${Math.floor(userXp / 1000)}K`;
      }
      if (userLvl > 1000) {
        userLvl = `${userLvl / 1000}K`;
      }

      const canvas = Canvas.createCanvas(700, 250);
      const context = canvas.getContext("2d");
      const background = await Canvas.loadImage("./files/lvlbackground.png");

      // This uses the canvas dimensions to stretch the image onto the entire canvas
      context.drawImage(background, 0, 0, canvas.width, canvas.height);

      context.font = applyText(canvas, user.tag);

      // Select the style that will be used to fill the text in
      context.fillStyle = "#ffffff";

      // Actually fill the text with a solid color
      context.fillText(user.tag, canvas.width / 2.5, canvas.height / 2.5);

      // Slightly smaller text placed above the member's display name
      context.font = "28px ValleyShadows";
      context.fillStyle = "#ffffff";
      context.fillText(
        `Level: ${userLvl} XP: ${userXp}/${lvlXp}`,
        canvas.width / 2.5,
        canvas.height / 1.8
      );

      // Horizontal line
      context.strokeStyle = `#ffffff`;
      context.lineWidth = 5;

      context.beginPath();
      context.moveTo(280, 110);
      context.lineTo(620, 110);
      context.stroke();

      // Draw BG Part
      for (let i = 0; i < 100; i++) {
        context.beginPath();
        context.lineWidth = 14;
        context.strokeStyle = `#ffffff`;
        context.fillStyle = `#ffffff`;
        context.arc(270 + i * 3.8, 190, 8, 0, Math.PI * 2, true);
        context.stroke();
        context.fill();
      }

      // Draw Level Part
      for (let i = 0; i < roundedPercent; i++) {
        context.beginPath();
        context.lineWidth = 14;
        context.strokeStyle = `#4f729d`;
        context.fillStyle = `#4f729d`;
        context.arc(270 + i * 3.8, 190, 8, 0, Math.PI * 2, true);
        context.stroke();
        context.fill();
      }

      // Pick up the pen
      context.beginPath();

      // Start the arc to form a circle
      context.arc(125, 125, 100, 0, Math.PI * 2, true);

      // Put the pen down
      context.closePath();

      // Clip off the region you drew on
      context.clip();

      // Using undici to make HTTP requests for better performance
      const { body } = await request(
        user.displayAvatarURL({ extension: "png" })
      );
      const avatar = await Canvas.loadImage(await body.arrayBuffer());

      // Draw a shape onto the main canvas
      context.drawImage(avatar, 25, 25, 200, 200);

      // Use the helpful Attachment class structure to process the file for you
      const attachment = new AttachmentBuilder(await canvas.encode("png"), {
        name: "profile-image.png",
      });
      interaction.reply({ files: [attachment] });
    }
  },
};
