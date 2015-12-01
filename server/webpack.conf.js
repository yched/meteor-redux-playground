module.exports = {
  entry: './main',
  resolve: {
    //root: path.resolve(__dirname + '/..'),
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
