import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router'
import reducer from './reducer'
import createCollectionReducers from './collections'

export default combineReducers({
  ...reducer,
  collections: createCollectionReducers('lists', 'players'),
  routing: routeReducer
})
