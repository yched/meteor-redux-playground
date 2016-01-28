import { createReducer } from 'redux-immutablejs';
import { combineReducers } from 'redux';
import { routeReducer } from 'react-router-redux'
import { collectionReducer } from 'client/helpers/redux_meteor'
import ImmutableModels from 'client/immutable_models'

// Structure of the store :
// (NOTE : createReducer() from redux-immutablejs means we use ImmutableJS structures)
//
// {
//   userInterface: {
//     selectedId: the _id of the currently selected player
//     playerView: the name of the current 'view' on the Players collection (see Players.views)
//   },
//
//   collections: {
//     players: {
//       [_id]: PlayerRecord({
//         _id,
//         name,
//         score
//       }),
//       [_id]: ...,
//       ...
//     },
//     lists: {
//       ...
//     }
//   }
//
// }
//

export default {

  routing: routeReducer,

  userInterface: createReducer({selectedId: '', playerView: 'by_index'}, {
    'SELECT_PLAYER': (state, {payload: playerId}) => state.merge({selectedId: playerId}),
    'SET_PLAYER_VIEW': (state, {payload: viewName}) => state.merge({playerView: viewName})
  }),

  collections: combineReducers({
    lists: collectionReducer('lists', ImmutableModels.list.record),
    players: collectionReducer('players', ImmutableModels.player.record)
  }),

  // Some reomte data fetched by direct HTTP calls.
  remoteData: createReducer({data: '', running: false, error: undefined}, {
    'FETCH_HTTP_STARTED': (state, {payload: url}) => state.merge({
      data: '',
      fetching: true,
      error: undefined
    }),
    'FETCH_HTTP_FINISHED': (state, {payload, error}) => state.merge({
      data: error ? '' : payload.substring(0, 50) + '...',
      fetching: false,
      error: payload.message
    })

  })
}
