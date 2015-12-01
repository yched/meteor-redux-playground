import { createStore, applyMiddleware } from 'redux';
import { combineReducers } from 'redux-immutablejs';
import { devTools, persistState } from 'redux-devtools';
import * as Immutable from 'immutable';

import * as reducers from './reducers';
import logger from './middlewares/logger';

let debugToolEnabled = 0;

const debugCreateStore = debugToolEnabled ? devTools()(
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))(
    createStore
  )
) : createStore;
const finalCreateStore = applyMiddleware(logger)(debugCreateStore);

let rootReducer = combineReducers(reducers);
const state = Immutable.fromJS({});

export default finalCreateStore(rootReducer, rootReducer(state));
