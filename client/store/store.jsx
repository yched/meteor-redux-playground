import { combineReducers } from 'redux-immutablejs';
import { devTools, persistState } from 'redux-devtools';
import * as reducers from './reducers';
import logger from './middlewares/logger';
import * as settings from 'settings.jsx';

// Use a wrapped version of redux.createStore() that takes arrays of
// middlewares and enhancers.
import createStoreWithEnhancers from '../helpers/redux_helpers';
const middleware = [
  logger
];
const enhancers = settings.debug ? [
  devTools(),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
] : [];
const createStore = createStoreWithEnhancers(middleware, enhancers);

const reducer = combineReducers(reducers);
export default createStore(reducer);
