import thunk from 'redux-thunk'
import logger from './middlewares/logger'
import trackMeteorCollection from './middlewares/track_meteor_collection'
import { devTools, persistState } from 'redux-devtools'

import reducer from 'client/reducers'
import * as settings from 'settings.jsx'

// Use a wrapped version of redux.createStore() that takes arrays of
// middlewares and enhancers.
import createStoreWithEnhancers from '../helpers/redux_helpers';

let middleware = [
  trackMeteorCollection,
  // Use thunk to trigger Meteor callbacks as actions with side effects
  thunk,
  logger
];

let enhancers = [];
enhancers.concat(settings.debug ? [
  devTools(),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
] : []);

const createStore = createStoreWithEnhancers(middleware, enhancers);

const store = createStore(reducer);

// Enable Webpack hot module replacement for reducers
module.hot && module.hot.accept('client/reducers', () => {
  store.replaceReducer(reducer)
});

export default store;
