import { createReducer } from 'redux-immutablejs';
import { combineReducers } from 'redux';
import * as Immutable from 'immutable';
import ImmutableModels from 'client/immutable_models';

export default (...collectionNames) => {
  const reducers = {};
  collectionNames.map(collectionName => {
    reducers[collectionName] = collectionReducer(collectionName)
  });
  return combineReducers(reducers);
}

function collectionReducer(collection) {
  const constructor = immutableCollectionConstructor.bind(null, ImmutableModels[collection].record);
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
function immutableCollectionConstructor(recordClass, docs, prev) {
  return docs.reduce(
    (map, doc) => {
      let record;
      if (prev.has(doc._id)) {
        // Note: Record.merge() changes the nature of the content of the record.
        // Manually set all properties instead...
        record = prev.get(doc._id);
        Object.keys(doc).map(key => {
          record = record.set(key, doc[key]);
        });
      }
      else {
        record = new recordClass(doc);
      }
      return map.set(doc._id, record);
    },
    Immutable.Map()
  );
}


