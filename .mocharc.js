module.exports = {
  recursive: true,
  reporter: 'spec',
  slow: 0,
  timeout: 30000,
  ui: 'bdd',
  extension: 'js',
  require: 'node_modules/mocha-expect-snapshot',
};
