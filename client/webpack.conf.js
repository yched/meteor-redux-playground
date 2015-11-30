module.exports = {
  entry: './main',
  externals: {
    "redux": "Redux",
    "react-redux": "ReactRedux",
    "redux-devtools": "ReduxDevTools",
    "redux-devtools/lib/react": "ReactReduxDevTools",
    "reselect": "Reselect",
    "redux-actions": "ReduxActions",
    "immutable": "Immutable",
    "redux-immutablejs": "ReduxImmutable",
    "react-immutable-proptypes": "ImmutablePropTypes",
    "react-addons-pure-render-mixin": "PureRenderMixin"
  },
  resolve: {
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
