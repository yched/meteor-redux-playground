import { combineReducers } from 'redux';
import { reduxReactRouter, routerStateReducer } from 'redux-router';
import { createHistory } from 'history';
import thunk from 'redux-thunk';
import logger from './middlewares/logger';
import trackMeteorCollection from './middlewares/track_meteor_collection';
import { devTools, persistState } from 'redux-devtools';
import * as reducers from './reducers';
import * as settings from 'settings.jsx';

// Use a wrapped version of redux.createStore() that takes arrays of
// middlewares and enhancers.
import createStoreWithEnhancers from '../helpers/redux_helpers';

let middleware = [
  trackMeteorCollection,
  // Use thunk to trigger Meteor callbacks as actions with side effects
  thunk,
  logger
];

let enhancers = [
  reduxReactRouter({
    createHistory
  })
];
enhancers.concat(settings.debug ? [
  devTools(),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
] : []);

const createStore = createStoreWithEnhancers(middleware, enhancers);

const reducer = combineReducers({...reducers, router: routerStateReducer});
const store = createStore(reducer)

// Enable Webpack hot module replacement for reducers
module.hot && module.hot.accept('./reducers', () => {
  const nextReducer = combineReducers({...require('./reducers.jsx'), router: routerStateReducer});
  store.replaceReducer(nextReducer)
});

export default store;
