import React from 'react';
import { compose, pure, setPropTypes } from 'recompose';
import { Provider } from 'react-redux';

let Root = props => {
  return (
    <Provider store={props.store}>
      {props.children}
    </Provider>
  )
};

Root = compose(
  pure,
  setPropTypes({
    store: React.PropTypes.object.isRequired,
  })
)(Root);


export default Root;
