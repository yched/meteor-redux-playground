// Temporary fix so that externals defined by the various meteor extensions
// (like Promise) are available in the global space.
// See https://github.com/thereactivestack/meteor-webpack/issues/38#issuecomment-166626296
import Symbol from 'symbol';
global.Symbol = Symbol;

import 'both/models/methods'
import 'server/publications'
import 'server/fixtures'
import * as settings from 'settings.jsx'

console.log("Starting Leaderboard Server...");

// @todo see https://github.com/thereactivestack/kickstart-hugeapp

// Import what's needed for Server-Side Rendering.
import ReactRouterSSR from './ssr.jsx'
import { syncReduxAndRouter } from 'redux-simple-router'
import routes from 'client/routes'
import createStore from 'client/store/store'
import Root from 'client/components/Root'

if (settings.ssr) {
  console.log('SSR !!');

  Meteor.startup(() => {
    ReactRouterSSR.Run(routes, {}, {
      wrapper: Root,
      createReduxStore: (history, initialState) => {
        // Initialize the store and bind it to the history.
        const store = createStore(initialState);
        syncReduxAndRouter(history, store);
        return store;
      }
    });
  });
}

