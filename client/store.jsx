const { createStore, combineReducers, applyMiddleware } = Redux;
const { devTools, persistState } = ReduxDevTools;

debugToolEnabled = 0;

const debugCreateStore = debugToolEnabled ? devTools()(
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))(
    createStore
  )
) : createStore;
const finalCreateStore = applyMiddleware(logger)(debugCreateStore);

// applyMiddleware takes createStore() and returns a new wrapped createStore
// note, this is an optional step to use middleware (we're auto console.log dispatches)
// let createStoreWithMiddleware = applyMiddleware(logger)(createStore);
// store = createStoreWithMiddleware(rootReducer);
let rootReducer = combineReducers({
  userInterface: Reducers.userInterface,
  players: Reducers.players
});
store = finalCreateStore(rootReducer);

// trigger action when this changes
//trackCollection(Players, (collection) => {
//  store.dispatch({
//    type: 'UPDATE_PLAYERS',
//  });
//});
