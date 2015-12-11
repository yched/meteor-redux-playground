import {createAction} from 'redux-actions';

export default {
  setPlayerView: createAction('SET_PLAYER_VIEW', viewName => (viewName)),
  selectPlayer: createAction('SELECT_PLAYER', playerId => playerId),
}
