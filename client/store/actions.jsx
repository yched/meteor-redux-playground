import {createAction} from 'redux-actions';

export default {
  incrementScore: createAction('INCREMENT_SCORE', (...[playerId, increment]) => ({playerId, increment})),
  selectPlayer: createAction('SELECT_PLAYER', playerId => playerId),
  dragPlayer: createAction('DRAG_PLAYER', (...[dragIndex, hoverIndex]) => ({dragIndex, hoverIndex}))
}
