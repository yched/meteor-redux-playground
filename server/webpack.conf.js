console.log(path.resolve(path.dirname(__dirname)));
module.exports = {
  entry: './main',
  resolve: {
    root: path.resolve(path.dirname(__dirname)),
    alias: {
      'both' : 'both',
      'server' : 'server'
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
