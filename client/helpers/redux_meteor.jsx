import { createReducer } from 'redux-immutablejs'
import * as Immutable from 'immutable'
import { createAction } from 'redux-actions'

export function collectionReducer(collection, recordClass) {
  const constructor = immutableMapConstructor.bind(null, recordClass);
  return createReducer([], {
    'TRACK_METEOR_COLLECTION_UPDATE': (state, {payload: {collectionName, docs}}) => {
      return collectionName === collection ?
        constructor(docs, state) :
        state;
    }
  }, null, constructor)
}

// Build an immutable map of records, trying to keep existing ones from a
// previous map.
function immutableMapConstructor(recordClass, docs, prevMap) {
  if (!docs.length) {
    return Immutable.Map();
  }

  let newMap;

  // If possible, start from the previous map by removing docs that are not in
  // the new data anymore.
  if (prevMap) {
    newMap = prevMap;
    const prevIds = prevMap.keySeq().toJS();
    const newIds = _.pluck(docs, '_id');
    _.difference(prevIds, newIds).map(id => {
      newMap = newMap.remove(id);
    });
  } else {
    newMap = Immutable.Map();
  }

  // Add the new docs.
  docs.map(doc => {
    let record = recordClass ? new recordClass(doc) : Immutable.fromJS(doc);
    // If a previous record existed for the _id, merge the new record into that
    // one, which preserves identity if the doc content didn't change.
    if (prevMap && prevMap.has(doc._id)) {
      record = prevMap.get(doc._id).merge(record);
    }
    newMap = newMap.set(doc._id, record);
  });

  return newMap;
}

// Action creators : Track updates to a Mongo collection cursor.
export const trackMeteorCollectionAction = createAction('TRACK_METEOR_COLLECTION', collections => collections);
const trackMeteorCollectionUpdate = createAction('TRACK_METEOR_COLLECTION_UPDATE', (collectionName, docs) => ({collectionName, docs}));

// Adapted from skinnygeek1010:flux-helpers Meteor package :
// - defined as a middleware,
// - also pass the collection to the callback, so that we can use a single action for
//   all tracked collections.
export const meteorCollectionMiddleware = store => next => action => {
  // Pass irrelavant actions down the line.
  if (action.type !== 'TRACK_METEOR_COLLECTION') {
    return next(action);
  }

  let collections = action.payload;

  // Autorun is not available on the server, we fake one that only does a
  // single run and returns a fake stop() callback.
  const autorun = Meteor.isClient ? Tracker.autorun : (func => {func(); return {stop: () => {}}});

  // Start one tracker per collection.
  const trackers = [];
  Object.keys(collections).map(collectionName => {
    const tracker = autorun(computation => {
      const args = collections[collectionName];
      // Note : fetch() is reactive.
      const docs = Mongo.Collection.get(collectionName).find(...args).fetch();
      //console.log('tracker', collectionName, docs);
      store.dispatch(trackMeteorCollectionUpdate(collectionName, docs));
    });
    trackers.push(tracker);
  });

  // Return an object with a stop() method to stop the trackers.
  return {
    stopped: false,
    stop() {
      this.stopped = true;
      trackers.map(tracker => tracker.stop());
    }
  }

};
