module.exports = {
  artifactsDir: "firefox-artifacts",
  build: {
    overwriteDest: true,
  },
  ignoreFiles: [
    'browser_style.css',
    'icons/*.png',
    'manifest.*.json',
    'package*.json',
    'web-ext-config*.js',
    '*artifacts',
 ],
};
