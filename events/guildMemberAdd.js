const Guild = require(`../schemas/guild`);
const { AttachmentBuilder } = require(`discord.js`);
const { createCanvas, Image } = require("@napi-rs/canvas");
const { readFile } = require("fs/promises");
const { request } = require("undici");
const checkGuildSchema = require("../checkGuildSchema");

const applyText = (canvas, text) => {
  const context = canvas.getContext("2d");
  let fontSize = 70;

  do {
    context.font = `${(fontSize -= 10)}px ValleyShadows`;
  } while (context.measureText(text).width > canvas.width - 300);

  return context.font;
};

module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const canvas = createCanvas(700, 250);
    const context = canvas.getContext("2d");

    const background = await readFile("./files/background.png");
    const backgroundImage = new Image();
    backgroundImage.src = background;
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    context.strokeStyle = "#4E6766";
    context.strokeRect(0, 0, canvas.width, canvas.height);

    context.font = `35px ValleyGrll`;
    context.fillStyle = "#1E152A";
    context.fillText(`WELCOME!!!`, canvas.width / 2.5, canvas.height / 2.5);

    context.font = applyText(canvas, `${member.displayName}!`);
    context.fillStyle = "#392759";
    context.fillText(
      `${member.displayName}!`,
      canvas.width / 2.5,
      canvas.height / 1.4
    );

    context.beginPath();
    context.arc(125, 125, 100, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();

    const { body } = await request(member.displayAvatarURL({ format: "jpg" }));
    const avatar = new Image();
    avatar.src = Buffer.from(await body.arrayBuffer());
    context.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
      name: "welcome-image.png",
    });

    let guildProfile = await Guild.findOne({ guildId: member.guild.id });
    checkGuildSchema(member.guild);
    if (!guildProfile.has("welcomeChannel")) return;
    member.guild.channels.cache
      .get(guildProfile.welcomeChannel)
      .send({ files: [attachment] })
      .catch((err) => console.log(err));
  },
};
