module.exports = {
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