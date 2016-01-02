import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'
import reducer from './reducer'
import collectionReducer from './collections'
import ImmutableModels from 'client/immutable_models';

export default combineReducers({
  ...reducer,
  collections: combineReducers({
    lists: collectionReducer('lists', ImmutableModels.list.record),
    players: collectionReducer('players', ImmutableModels.player.record)
  }),
  routing: routeReducer
})
