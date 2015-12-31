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

if (settings.ssr) {
  console.log('SSR !!');

  // Import what's needed for Server-Side Rendering.
  const ReactRouterSSR = require('../ssr/server');
  const routes = require('client/routes');
  const createReduxStore = require('client/store/store');
  const Root = require('client/containers/Root');

  Meteor.startup(() => {
    ReactRouterSSR.Run(routes, {}, {
      wrapper: Root,
      createReduxStore
    });
  });
}
