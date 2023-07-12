const path = require('path');

module.exports = {
  entry: {
    favorites: './src/favorites.js',
    frontend: './src/frontend.js'
  },
 output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'development',
  watch: true
};
