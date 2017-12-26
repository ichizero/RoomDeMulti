module.exports = {
  entry: './src/index.js',
  output: {
    path: require('path').resolve("./dist/"),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  devServer: {
    contentBase: 'dist',
    historyApiFallback: true
  },
}