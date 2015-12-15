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
    'TRACK_PLAYER_COLLECTION': (state, {payload: {docs}}) => {
      // Ditch the players 'index' property to avoid needless immutable changes and repaints.
      let players = _.map(docs, player => _.omit(player, 'index'));
      // Key players by id for easier tracking.
      players = _.indexBy(players, '_id');

      // Build the new immutable list for players, trying to keep existing
      // PlayerRecords when they still match.
      const prev = state.get('players');
      const next = Immutable.fromJS(players, (key, data) => {
        // Merge the new player data into the previous immutable if there is one,
        // else create a new record.
        if (key) {
          return prev.has(key) ? prev.get(key).merge(data) : new PlayerRecord(data);
        }
        // The function is called one last time for the whole list, with key = ''.
        return data.toMap();
      });

      return state.merge({
        players: next
      });
    }
  })
}
