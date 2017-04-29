module.exports = {
  entry : ['babel-polyfill', './js/index.js'],
  output: {
    path: __dirname + '/public/javascripts',
    filename: 'script.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/',
        query: {
          cacheDirectory: true,
          presets: ['env', 'react']
        }
      }
    ]
  }
}
