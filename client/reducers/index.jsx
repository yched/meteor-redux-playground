import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router'
import reducer from './reducer'
import collections from './collections'

export default combineReducers({
  ...reducer,
  collections,
  routing: routeReducer
})
