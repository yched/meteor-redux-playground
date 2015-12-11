import { createReducer } from 'redux-immutablejs';

export default {
  userInterface: createReducer({selectedId: '', sort: {field: 'index', order: 1}}, {
    'SELECT_PLAYER': (state, {payload: playerId}) => state.merge({selectedId: playerId}),
    'SET_SORTING': (state, {payload: {field, order}}) => state.merge({sort: {field, order}})
  }),
}
