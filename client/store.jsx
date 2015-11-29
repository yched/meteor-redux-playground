const { createStore, applyMiddleware } = Redux;
const { combineReducers } = ReduxImmutable;
const { devTools, persistState } = ReduxDevTools;

debugToolEnabled = 0;

const debugCreateStore = debugToolEnabled ? devTools()(
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))(
    createStore
  )
) : createStore;
const finalCreateStore = applyMiddleware(logger)(debugCreateStore);

let rootReducer = combineReducers(Reducers);
const state = Immutable.fromJS({});

store = finalCreateStore(rootReducer, rootReducer(state));
