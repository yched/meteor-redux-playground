import { createReducer } from 'redux-immutablejs';
import * as Immutable from 'immutable';
import { Players } from '../../both/models/player';

console.log(Immutable);
export default {
  players: createReducer(Immutable.fromJS([]), {
    'INCREMENT_SCORE': (players, {payload: {playerId, increment}}) => {
      Meteor.call('incrementScore', playerId, increment);
      return players;
    },
  }),
  userInterface: createReducer(Immutable.fromJS({selectedId: '', sort: {field: 'index', order: 1}}), {
    'SELECT_PLAYER': (userInterface, {payload: playerId}) => userInterface.set('selectedId', playerId),
    'SET_SORTING': (userInterface, {payload: {field, order}}) =>
      userInterface.setIn(['sort', 'field'], field).setIn(['sort', 'order'], order)
  })
}
