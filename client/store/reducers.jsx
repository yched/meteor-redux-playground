import { createReducer } from 'redux-immutablejs';

export default {
  userInterface: createReducer({selectedId: '', playerView: 'by_index'}, {
    'SELECT_PLAYER': (state, {payload: playerId}) => state.merge({selectedId: playerId}),
    'SET_PLAYER_VIEW': (state, {payload: viewName}) => state.merge({playerView: viewName})
  }),
}
