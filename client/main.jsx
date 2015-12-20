import { createHistory } from 'history'
import { syncReduxAndRouter } from 'redux-simple-router'
import { withProps } from 'recompose'

import ReactRouterSSR from './ssr'
import Root from 'client/components/Root'

import createStore from 'client/store/store'
import routes from './routes'
import * as settings from 'settings.jsx'

import 'both/models/methods'

Meteor.startup(() => {

  // Create the store, with the initial state sent by the server rendering
  // if enabled (else empty initial state)
  const store = createStore(window.__INITIAL_STATE__);

  // Enable Webpack hot module replacement for the store's reducers
  // @todo Even if SSR ?
  module.hot && module.hot.accept('client/reducers', () => {
    store.replaceReducer(reducer)
  });

  // Create the browser navigation history and bind it to the store.
  const history = createHistory();
  syncReduxAndRouter(history, store);

  // Do the rendering (note : this works even if SSR is not enabled on the server-side)
  ReactRouterSSR.Run(routes, {
    history,
    // Wrap in the <Root> component, bound to our store.
    wrapper: withProps({store, debug: settings.debug}, Root)
  });

});


