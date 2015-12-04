import {createAction} from 'redux-actions';

export default {
  incrementScore: createAction('INCREMENT_SCORE', (...[playerId, increment]) => ({playerId, increment})),
  selectPlayer: createAction('SELECT_PLAYER', playerId => playerId),
  reorderPlayer: createAction('REORDER_PLAYER', (...[playerId, index]) => ({playerId, index}))
}
