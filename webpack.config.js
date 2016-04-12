module.exports = {
  entry: {
    pageA: "./src/page-katex.js",
    pageB: "./src/page-mathjax.js"
  },
  output: {
    path: "./public/js",
    publicPath: "/public/js/",
    filename: "[name].js"
  },
  module: {
    loaders: [
      { test: /\.styl$/, loader: "style!css!stylus" },
      { test: /\.html$/, loader: "html" },
      { test: /\.json$/, loader: "json-loader" }
    ]
  }
}