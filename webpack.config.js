const path = require('path');

module.exports = {
  entry: [
    './src/index.js',
    './src/helpers/helpers.js'
  ],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  watch: true
};