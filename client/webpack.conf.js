module.exports = {
  entry: './main',
  resolve: {
    root: path.resolve(path.dirname(__dirname)),
    alias: {
      'both' : 'both',
      'client' : 'client'
    },
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
