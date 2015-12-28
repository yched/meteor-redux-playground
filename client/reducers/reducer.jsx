import { createReducer } from 'redux-immutablejs';
import * as Immutable from 'immutable';
import Players from 'both/models/player';
import { PlayerRecord, getPlayerRecordMap } from 'client/immutable_models/player';

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

  playersCollection: createReducer({viewName: 'by_index', players: {}, loaded: false}, {

    'SET_PLAYER_VIEW': (state, {payload: viewName}) => {
      // Do nothing if the incoming viewName is unchanged or invalid.
      return viewName !== state.get('viewName') && Players.views.hasOwnProperty(viewName) ?
        state.merge({
          viewName,
          loaded: false
        }) :
        state;
    },

    'TRACK_METEOR_COLLECTION_UPDATE': (state, {payload: {collectionName, docs}}) => {
      // @TODO organize the store by collection name...
      if (collectionName === 'players') {
        // Ditch the players 'index' property to avoid needless immutable changes and repaints.
        let players = _.map(docs, player => _.omit(player, 'index', 'listId'));
        // Key players by id for easier tracking.
        players = _.indexBy(players, '_id');

        return state.merge({
          loaded: true,
          players: getPlayerRecordMap(players, state.get('players'))
        });
      }
      return state;
    }

  }, true, playersCollectionConstructor),

  // Some reomte data fetched by direct HTTP calls.
  remoteData: createReducer({data: '', running: false, error: undefined}, {

    'FETCH_HTTP_STARTED': (state, {payload: url}) => state.merge({
      data: '',
      running: url,
      error: undefined
    }),

    'FETCH_HTTP_FINISHED': (state, {payload, error}) => state.merge({
      data: error ? '' : payload.substring(0, 20),
      running: false,
      error: payload.message
    })

  })
}

// Used when receiving the initial state sent by server rendering.
// We need to recreate the PlayerRecords in the 'players' map.
function playersCollectionConstructor({players, ...rest}) {
  return Immutable.fromJS({
    players: getPlayerRecordMap(players),
    ...rest
  })
}
