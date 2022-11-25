module.exports = {
  name: "nodeConnect",
  execute(node) {
    console.log(`Node "${node.options.identifier}" connected.`);
  },
};
