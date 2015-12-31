import { createReducer } from 'redux-immutablejs';
import { combineReducers } from 'redux';
import * as Immutable from 'immutable';
import ImmutableModels from 'client/immutable_models';

const collectionReducer = (collection) => {
  const constructor = immutableCollectionConstructor.bind(null, ImmutableModels[collection].record);
  return createReducer([], {
    'TRACK_METEOR_COLLECTION_UPDATE': (state, {payload: {collectionName, docs}}) => {
      if (collectionName === 'players') console.log('reducer - players:', docs.map(player => player.name));
      return collectionName === collection ?
        constructor(docs, state) :
        state;
    }
  }, null, constructor)
};

// Build an immutable map of records, trying to keep existing ones from an
// existing map when they still match.
function immutableCollectionConstructor(record, docs, prev) {
  return docs.reduce(
    (map, doc) => map.set(doc._id, prev.has(doc._id) ? prev.get(doc._id).merge(doc) : new record(doc)),
    Immutable.Map()
  );
}

export default combineReducers({
  lists: collectionReducer('lists'),
  players: collectionReducer('players'),
});
