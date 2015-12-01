module.exports = {
  entry: './main',
  resolve: {
    // @todo see https://webpack.github.io/docs/configuration.html#resolve
    //root: path.resolve(__dirname + '/..'),
    //alias: {
    //  'both' : '/both'
    //},
    extensions: ['', '.js', '.jsx', '.json']
  },
  module: {
    loaders: [
      { test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/ }
    ]
  }
};
