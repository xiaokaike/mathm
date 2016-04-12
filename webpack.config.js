module.exports = {
  entry: "./src/main.js",
  output: {
    path: "./public/build",
    publicPath: "/public/build/",
    filename: "build.js"
  },
  module: {
    loaders: [
      { test: /\.styl$/, loader: "style!css!stylus" },
      { test: /\.html$/, loader: "html" },
      { test: /\.json$/, loader: "json-loader" }
    ]
  }
}