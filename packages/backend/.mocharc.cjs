module.exports = {
  require: "ts-node/register",
  loader: "ts-node/esm",
  extensions: ["ts", "tsx"],
  spec: ["test/**/*.test.*"],
  'watch-files': ["src"],
  reporter: "dot",
  slow: 75,
  timeout: 4000,
  ui: "bdd",
  // parallel: true,
  // jobs: 2
};
