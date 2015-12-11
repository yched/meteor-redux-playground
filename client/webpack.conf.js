module.exports = {
  entry: './main',
  resolve: {
    root: path.resolve(path.dirname(__dirname)),
    alias: {
      'both' : 'both',
      'client' : 'client',
      'node_modules' : 'node_modules'
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
