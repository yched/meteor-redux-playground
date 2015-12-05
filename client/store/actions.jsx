import {createAction} from 'redux-actions';

export default {
  setSorting: createAction('SET_SORTING', sort => sort),
  incrementScore: createAction('INCREMENT_SCORE', (...[playerId, increment]) => ({playerId, increment})),
  selectPlayer: createAction('SELECT_PLAYER', playerId => playerId),
  dragPlayer: createAction('DRAG_PLAYER', (...[playerId, newIndex]) => ({playerId, newIndex})),
  dropPlayer: createAction('DROP_PLAYER')
}
