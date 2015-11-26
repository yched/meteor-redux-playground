const { handleActions } = ReduxActions;

Reducers = {
  userInterface: handleActions({
    'SELECT_PLAYER': (state, {payload: playerId}) => ({
      ...state,
      selectedId: playerId
    })
  }, {selectedId: ''}),
  players: handleActions({
    'INCREMENT_SCORE': (state, {payload: {playerId, increment}}) => {
      Meteor.call('incrementScore', playerId, increment);
      return state;
    },
    'UPDATE_PLAYERS': () => {
      return Players.find({}, {sort: {score: -1}}).fetch();
    }
  }, [])
};
