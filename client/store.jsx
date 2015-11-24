const { createStore, combineReducers, applyMiddleware } = Redux;
const { devTools, persistState } = ReduxDevTools;

// Redux has a single store. to reduce complexity it allows you to combine
// several 'reducer' functions that share this single state object.
// They are combined into one root reducer which is passed to the store
//
// the shape of root reducer will then look like:
//    {
//      userInterface: {
//        selectedId: 'ds34sjsa34',
//      },
//      players: [
//        { mongo doc },
//        { mongo doc },
//        { mongo doc }
//      ]
//    }

const rootReducer = combineReducers({
  userInterface: Reducers.userInterface,
  collections: Reducers.collections,
});

let initialState = {
  userInterface: {
    selectedId: ''
  },
  collections: {
  },
};

const finalCreateStore =
  applyMiddleware(logger)(
    devTools()(
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))(
        createStore
      )
    )
  );

// applyMiddleware takes createStore() and returns a new wrapped createStore
// note, this is an optional step to use middleware (we're auto console.log dispatches)
// let createStoreWithMiddleware = applyMiddleware(logger)(createStore);
// store = createStoreWithMiddleware(rootReducer);
//
store = finalCreateStore(rootReducer, initialState);

myTrackCollection = function(collection, callback) {
  if (!collection || !callback) {
    throw Error('Collection and callback params needed');
  }
  // only run on the client, not needed for SSR
  if (Meteor.isClient) {
    Meteor.startup(function() {
      Tracker.autorun(function(computation) {
        var docs = collection.find().fetch();
        if (computation.firstRun) {
          return;  // ignore first empty run
        }
        if (this.__debugFluxHelpers) { // universal global
          console.log('[Tracker] collection changed', docs);
        }
        callback(collection, docs);
      });
    });
  }
};

// trigger action when this changes
myTrackCollection(Players, (collection) => {
  store.dispatch(CollectionActions.collectionChanged(collection));
});
