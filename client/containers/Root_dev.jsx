import React from 'react';
import { compose, pure, setPropTypes } from 'recompose';
import { Provider } from 'react-redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

let Root = props => {
  const children = props.devTools ?
    <div>
      {props.children}
      {props.devTools ?
        <DebugPanel top right bottom>
          <DevTools store={props.store} monitor={LogMonitor}/>
        </DebugPanel>
        : ''
      }
    </div> :
    props.children;
  return (
    <Provider store={props.store}>
      {children}
    </Provider>
  )
};

Root = compose(
  pure,
  setPropTypes({
    store: React.PropTypes.object.isRequired,
    devTools: React.PropTypes.bool
  })
)(Root);


export default Root;
