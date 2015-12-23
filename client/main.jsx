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

  // Do the rendering (note : this works even if SSR is not enabled on the server-side)
  ReactRouterSSR.Run(routes, {
    wrapper: withProps({debug: settings.debug}, Root),
    history: createHistory(),
    createReduxStore: (history, initialState) => {
      const store = createStore(initialState);
      syncReduxAndRouter(history, store);
      // Enable Webpack hot module replacement for the store's reducers
      // @todo Even if SSR ?
      module.hot && module.hot.accept('client/reducers', () => {
        store.replaceReducer(reducer)
      });
      return store;
    }
  });

});


