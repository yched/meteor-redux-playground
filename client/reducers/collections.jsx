import { createReducer } from 'redux-immutablejs'
import * as Immutable from 'immutable'

export default (collection, recordClass) => {
  const constructor = immutableCollectionConstructor.bind(null, recordClass);
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
function immutableCollectionConstructor(recordClass, docs, prevMap) {
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
    let record = new recordClass(doc);
    // If a previous record existed for the _id, merge the new record into that
    // one, which preserves identity if the doc content didn't change.
    if (prevMap && prevMap.has(doc._id)) {
      record = prevMap.get(doc._id).merge(record);
    }
    newMap = newMap.set(doc._id, record);
  });

  return newMap;
}


