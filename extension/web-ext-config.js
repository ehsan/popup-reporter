module.exports = {
  build: {
    overwriteDest: true,
  },
  ignoreFiles: [
    'icons/*.png',
    'manifest.*.json',
    'package*.json',
    'web-ext-config.js',
    '*artifacts',
  ],
};