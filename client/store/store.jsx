import multi from 'redux-multi'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise'
import { syncHistory } from 'react-router-redux'

import reducer from 'client/reducers'
import * as settings from 'settings.jsx'

// Use a wrapped version of redux.createStore() that takes arrays of
// middlewares and enhancers.
import createStoreWithEnhancers from '../helpers/redux_helpers';

// Export a createStore function : (initialState, history) => store
export default function (initialState, history) {
  let routerMiddleware = syncHistory(history);
  let middleware = [
    // Allows an action creator to dispatch an array of actions.
    multi,
    // Use thunk to trigger Meteor callbacks as actions with side effects
    thunk,
    // Dispatch Promises for async actions
    promiseMiddleware,
    // react-router-redux
    routerMiddleware
  ];
  // Console action logger.
  if (process.env.NODE_ENV !== 'production') {
    const logger = require('./middlewares/logger');
    middleware.push(logger);
  }

  let enhancers = [];
  // Redux-devtools
  if (Meteor.isClient && settings.debug && process.env.NODE_ENV !== 'production') {
    const { devTools, persistState } = require('redux-devtools');
    enhancers.push(devTools());
    enhancers.push(persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)));
  }

  // Create the store.
  const finalCreateStore = createStoreWithEnhancers(middleware, enhancers);
  const store = finalCreateStore(reducer, initialState);

  if (Meteor.isClient && process.env.NODE_ENV !== 'production') {
    // Enable replay of router actions
    routerMiddleware.listenForReplays(store);

    // Enable Webpack hot module replacement for the store's reducers
    module.hot && module.hot.accept('client/reducers', () => {
      store.replaceReducer(require('client/reducers'))
    });
  }

  return store;
}
