import {createAction} from 'redux-actions';

export default {
  setSorting: createAction('SET_SORTING', (...[field, order]) => ({field, order})),
  incrementScore: createAction('INCREMENT_SCORE', (...[playerId, increment]) => ({playerId, increment})),
  selectPlayer: createAction('SELECT_PLAYER', playerId => playerId),
}
