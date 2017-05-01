module.exports = {
  entry : ['babel-polyfill', './js/index.js'],
  output: {
    path: __dirname + '/public/javascripts',
    filename: 'script.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {test: /\.node$/, loader: 'node-loader'},
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'react', 'stage-0']
        }
      }
    ]
  }
}
