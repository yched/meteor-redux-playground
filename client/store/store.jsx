const { createStore, applyMiddleware } = Redux;
const { combineReducers } = ReduxImmutable;
const { devTools, persistState } = ReduxDevTools;

import * as reducers from './reducers';
import logger from './middlewares/logger';

debugToolEnabled = 0;

const debugCreateStore = debugToolEnabled ? devTools()(
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))(
    createStore
  )
) : createStore;
const finalCreateStore = applyMiddleware(logger)(debugCreateStore);

let rootReducer = combineReducers(reducers);
const state = Immutable.fromJS({});

export default finalCreateStore(rootReducer, rootReducer(state));
