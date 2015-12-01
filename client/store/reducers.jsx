const { createReducer } = ReduxImmutable;
const immutable = Immutable.fromJS;
import {Players} from '../../both/models/player';

export default {
  players: createReducer(immutable([]), {
    'INCREMENT_SCORE': (state, {payload: {playerId, increment}}) => {
      Meteor.call('incrementScore', playerId, increment);
      return state;
    },
    'UPDATE_PLAYERS': () => {
      return immutable(Players.find({}, {sort: {score: -1}}).fetch());
    }
  }),
  userinterface: createReducer(immutable({selectedId: ''}), {
    'SELECT_PLAYER': (state, {payload: playerId}) => state.merge({
      selectedId: playerId
    })
  })
}
