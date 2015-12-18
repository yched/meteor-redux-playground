import React from 'react';
import { compose, pure, setPropTypes } from 'recompose';
import { Provider } from 'react-redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { Router } from 'react-router'
import { createHistory } from 'history'
import { syncReduxAndRouter } from 'redux-simple-router'

let Root = props => {
  // Create the router history and bind it to the store.
  const history = createHistory();
  syncReduxAndRouter(history, props.store);

  return (
    <div>
      <Provider store={props.store}>
        <Router history={history}>
          {props.routes}
        </Router>
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
    routes: React.PropTypes.object.isRequired,
    debug: React.PropTypes.bool
  })
)(Root);


export default Root;
