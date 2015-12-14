import { createReducer } from 'redux-immutablejs';
import * as Immutable from 'immutable';
import Players from 'both/models/player';
import { PlayerRecord } from 'client/immutable_models/player';

// Structure of the store :
// (NOTE : createReducer() from redux-immutablejs means we use ImmutableJS structures)
//
// {
//   userInterface: {
//     selectedId: the _id of the currently selected player
//   },
//   playersCollection: {
//     viewName: the name of the current 'view' on the Players collection (see Players.views)
//     players: {
//       [_id]: PlayerRecord({
//         _id,
//         name,
//         score
//       }),
//       [_id]: ...,
//       ...
//     }
//   }
// }
//
export default {

  userInterface: createReducer({selectedId: ''}, {
    'SELECT_PLAYER': (state, {payload: playerId}) => state.merge({selectedId: playerId}),
  }),

  playersCollection: createReducer({viewName: 'by_index', players: {}}, {
    'SET_PLAYER_VIEW': (state, {payload: viewName}) => {
      // Do nothing if the incoming viewName is invalid.
      return Players.views.hasOwnProperty(viewName) ?
        state.merge({
          viewName
        }) :
        state;
    },
    'TRACK_PLAYER_COLLECTION': (state, {payload: {docs}}) => state.merge({
      players: getImmutablePlayers(docs, state.get('players'))
    })
  })
}

/**
 * Returns an immutable list for players, trying to preserve previous immutable
 * PlayerRecords when they still match.
 */
function getImmutablePlayers(players, prevImmutable) {
  // Ditch the players 'index' property to avoid needless immutable changes and repaints.
  players = _.map(players, player => _.omit(player, 'index'));
  // Key players by id for easier tracking.
  players = _.indexBy(players, '_id');

  // Build the new Immutable list, preserving from the old one when possible.
  return Immutable.fromJS(players, (key, data) => {
    // The function is called one last time for the whole list, with key = ''.
    if (!key) {
      return data.toMap();
    }
    // Merge the new player data into the previous immutable if there is one,
    // else create a new record.
    return prevImmutable.has(key) ? prevImmutable.get(key).merge(data) : new PlayerRecord(data);
  });
}
