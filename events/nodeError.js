module.exports = {
  name: "nodeError",
  execute(node, error) {
    console.log(
      `Node "${node.options.identifier}" encountered an error: ${error.message}.`
    );
  },
};
