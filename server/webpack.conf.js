module.exports = {
  entry: './main',
  resolve: {
    root: path.resolve(path.dirname(__dirname)),
    alias: {
      'both' : 'both',
      'server' : 'server',
      // We'll include client files as well, for SSR.
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
