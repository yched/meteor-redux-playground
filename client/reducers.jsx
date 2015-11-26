const { handleActions } = ReduxActions;
const { bindReactiveData } = MeteorRedux;

Reducers = {
  userInterface: handleActions({
    'SELECT_PLAYER': (state, {payload}) => ({
      ...state,
      selectedId: payload
    })
  }, {selectedId: ''}),
  players: handleActions({
    'INCREMENT_SCORE': (state, {payload}) => {
      //debugger;
      Meteor.call('incrementScore', payload.playerId, payload.increment);
      return state;
    },
    'UPDATE_PLAYERS': () => {
      return [{_id: 'foo', name: 'Foo', score: Math.floor(Math.random() * 10) * 10}];
    }
  }, [])
};
Reducers.players = bindReactiveData(Reducers.players, () => Players.find({}, {sort: {score: -1}}).fetch());
