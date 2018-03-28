module.exports = {
  artifactsDir: "chrome-artifacts",
  build: {
    overwriteDest: true,
  },
  ignoreFiles: [
    'icons/*.svg',
    'manifest.*.json',
    'package*.json',
    'web-ext-config*.js',
    '*artifacts',
  ],
};