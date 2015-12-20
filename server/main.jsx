import 'both/models/methods'
import 'server/publications'
import 'server/fixtures'
import * as settings from 'settings.jsx'

console.log("Starting Leaderboard Server...");

// @todo see https://github.com/thereactivestack/kickstart-hugeapp

// Import what's needed for Server-Side Rendering.
import ReactRouterSSR from './ssr.jsx'
import { createMemoryHistory } from 'history'
import { syncReduxAndRouter } from 'redux-simple-router'
import { withProps } from 'recompose'
import createStore from 'client/store/store'
import routes from 'client/routes'
import Root from 'client/components/Root'

if (settings.ssr) {
  console.log('SSR !!');
// @todo
// http://rackt.org/redux/docs/recipes/ServerRendering.html
// You may want to read Async Actions to learn more about expressing asynchronous
// flow in Redux with async primitives such as Promises and thunks. Keep in mind that
// anything you learn there can also be applied to universal rendering.

// If you use something like React Router, you might also want to express your
// data fetching dependencies as static fetchData() methods on your route handler components.
// They may return async actions, so that your handleRender function can match
// the route to the route handler component classes, dispatch fetchData() result
// for each of them, and render only after the Promises have resolved. This way
// the specific API calls required for different routes are colocated with the
// route handler component definitions. You can also use the same technique on
// the client side to prevent the router from switching the page until its data has been loaded.

// see https://github.com/jlongster/react-redux-universal-hot-example/commit/e13b93518c8c9b5524ad50f1c566ed6c480c1888?diff=split

  Meteor.startup(() => {
    // Initialize the store.
    const store = createStore();

    // Create the browser navigation history and bind it to the store.
    const history = createMemoryHistory();
    syncReduxAndRouter(history, store);

    // Do the rendering.
    ReactRouterSSR.Run(routes, {}, {
      // Wrap in the <Root> component, bound to our store.
      wrapper: withProps({store}, Root),
      // Put the matched url in the history, so that it dispatches to the store.
      preRender: (req, res) => history.replace(req.url),
      // After rendering was done, pass the resulting store state to the client
      // so that he can start from there.
      appendCallback: () => `<script>window.__INITIAL_STATE__ = ${JSON.stringify(store.getState())}</script>`
    });
  });
}

