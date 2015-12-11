import * as reducers from './reducers';
import { combineReducers } from 'redux-immutablejs';
import logger from './middlewares/logger';
import { devTools, persistState } from 'redux-devtools';
import * as settings from 'settings.jsx';

// Use a wrapped version of redux.createStore() that takes arrays of
// middlewares and enhancers.
import createStoreEnhanced from '../helpers/redux_helpers';

const middleware = [
  logger
];
const enhancers = settings.debug ? [
  devTools(),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
] : [];
const createStore = createStoreEnhanced(middleware, enhancers);

const reducer = combineReducers(reducers);
export default createStore(reducer);
