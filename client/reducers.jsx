const { createReducer } = ReduxImmutable;
const immutable = Immutable.fromJS;

Reducers = {
  userInterface: createReducer(immutable({selectedId: ''}), {
    'SELECT_PLAYER': (state, {payload: playerId}) => state.merge({
      selectedId: playerId
    })
  }),
  players: createReducer(immutable([]), {
    'INCREMENT_SCORE': (state, {payload: {playerId, increment}}) => {
      Meteor.call('incrementScore', playerId, increment);
      return state;
    },
    'UPDATE_PLAYERS': () => {
      return immutable(Players.find({}, {sort: {score: -1}}).fetch());
    }
  })
};
