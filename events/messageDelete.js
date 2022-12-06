const checkMessage = require("../checkMessage");

module.exports = {
  name: "messageDelete",
  async execute(message) {
    await checkMessage(message);
  },
};
