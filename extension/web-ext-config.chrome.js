module.exports = {
  build: {
    overwriteDest: true,
  },
  artifactsDir: "chrome-artifacts",
  ignoreFiles: [
    'icons/*.svg',
    'manifest.*.json',
    'package*.json',
    'web-ext-config*.js',
    '*artifacts',
  ],
};