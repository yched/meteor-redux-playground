import {createAction} from 'redux-actions';

export default {
  setSorting: createAction('SET_SORTING', (field, order) => ({field, order})),
  selectPlayer: createAction('SELECT_PLAYER', playerId => playerId),
}
