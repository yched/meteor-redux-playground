import * as reducers from './reducers';
import { combineReducers } from 'redux-immutablejs';
import logger from './middlewares/logger';
import { devTools, persistState } from 'redux-devtools';
import * as settings from '../../settings.jsx';

const reducer = combineReducers(reducers);


const middleware = [
  logger
];
const enhancers = settings.debug ? [
  devTools(),
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
] : [];

// Use a wrapped version of redux.createStore() that takes an array of middlewares and enhancers.
import createStore from '../redux_helpers';
export default createStore(reducer, middleware, enhancers);
