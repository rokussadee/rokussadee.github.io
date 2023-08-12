const path = require("path");

module.exports = {
  mode: "production",  
  entry: {
  favorites: './src/favorites.js',
  wishlist: './src/wishlist.js',
  axios: './src/axios.js'
},
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
};
