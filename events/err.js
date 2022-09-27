module.exports = {
  name: "err",
  execute(err) {
    console.log(`An error occurred with that database connection:\n${err}`);
  },
};
