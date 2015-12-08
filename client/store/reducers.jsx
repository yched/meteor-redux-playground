import { createReducer } from 'redux-immutablejs';

export default {
  userInterface: createReducer({selectedId: '', sort: {field: 'index', order: 1}}, {
    'SELECT_PLAYER': (userInterface, {payload: playerId}) => userInterface.set('selectedId', playerId),
    'SET_SORTING': (userInterface, {payload: {field, order}}) => userInterface.setIn(['sort', 'field'], field).setIn(['sort', 'order'], order)
  }),
}
