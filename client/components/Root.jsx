import React from 'react';
import { compose, pure, setPropTypes } from 'recompose';
import { Provider } from 'react-redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

let Root = props => {
  console.log('Root', props.store.getState());
  return (
    <div>
      <Provider store={props.store}>
        {props.children}
      </Provider>
      { props.debug ?
        <DebugPanel top right bottom>
          <DevTools store={props.store} monitor={LogMonitor} />
        </DebugPanel>
        : ''
      }
    </div>
  )
};

Root = compose(
  pure,
  setPropTypes({
    store: React.PropTypes.object.isRequired,
    debug: React.PropTypes.bool
  })
)(Root);


export default Root;
