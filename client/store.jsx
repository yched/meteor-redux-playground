const { createStore, combineReducers, applyMiddleware } = Redux;
const { devTools, persistState } = ReduxDevTools;

debugToolEnabled = 0;

const debugCreateStore = debugToolEnabled ? devTools()(
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))(
    createStore
  )
) : createStore;
const finalCreateStore = applyMiddleware(logger)(debugCreateStore);

let rootReducer = combineReducers(Reducers);
store = finalCreateStore(rootReducer);
