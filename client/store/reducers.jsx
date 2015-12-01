import { createReducer } from 'redux-immutablejs';
import * as Immutable from 'immutable';
import { Players } from '../../both/models/player';

console.log(Immutable);
export default {
  players: createReducer(Immutable.fromJS([]), {
    'INCREMENT_SCORE': (state, {payload: {playerId, increment}}) => {
      Meteor.call('incrementScore', playerId, increment);
      return state;
    },
    'UPDATE_PLAYERS': () => {
      return Immutable.fromJS(Players.find({}, {sort: {score: -1}}).fetch());
    }
  }),
  userInterface: createReducer(Immutable.fromJS({selectedId: ''}), {
    'SELECT_PLAYER': (state, {payload: playerId}) => state.merge({
      selectedId: playerId
    })
  })
}
