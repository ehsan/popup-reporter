module.exports = {
  artifactsDir: "chrome-artifacts",
  build: {
    overwriteDest: true,
  },
  ignoreFiles: [
    'manifest.*.json',
    'package*.json',
    'web-ext-config*.js',
    '*artifacts',
  ],
};
