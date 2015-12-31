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
  if (!docs.length) {
    return Immutable.Map();
  }

  let newMap;

  // If possible, start from the previous map, and remove docs that are not in
  // the new data.
  if (prev) {
    newMap = prev;
    const prevIds = prev.keySeq().toJS();
    const newIds = _.pluck(docs, '_id');
    _.difference(prevIds, newIds).map(id => {
      newMap = newMap.remove(id);
    });
  } else {
    newMap = Immutable.Map();
  }

  // Add the new docs, keeping records if they exist.
  docs.map(doc => {
    let record;
    if (prev && prev.has(doc._id)) {
      record = prev.get(doc._id);
      // Note: Record.merge() changes the nature of the content of the record.
      // Manually set all properties instead...
      Object.keys(doc).map(key => {
        record = record.set(key, doc[key]);
      });
    }
    else {
      record = new recordClass(doc);
    }
    newMap = newMap.set(doc._id, record);
  });

  return newMap;
}


