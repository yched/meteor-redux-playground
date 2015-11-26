const { handleActions } = ReduxActions;
const { bindReactiveData } = MeteorRedux;

Reducers = {
  userInterface: handleActions({
    'SELECT_PLAYER': (state, {playerId}) => {
      return _.extend({}, state, {
        selectedId: playerId,
      });
    }
  }, {selectedId: ''}),
  players: handleActions({
    'INCREMENT_SCORE': (state, {payload}) => {
      //debugger;
      Meteor.call('incrementScore', payload.playerId, payload.increment);
      return state;
    }
  }, [])
};
// @todo le Tracker là dedans rerun et redéclenche toutes les actions en permanence...
// @todo A cause des devtools ??
//Reducers.players = bindReactiveData(Reducers.players, () => Players.find({}, {sort: {score: -1}}).fetch());
Reducers.players = bindReactiveData(Reducers.players, () => {
  console.log('REACTIVE COLL');
  Players.find({}, {sort: {score: -1}}).fetch();
  return [{_id: 'foo', name: 'Foo', score: Math.floor(Math.random() * 10) * 10}];
  return Players.find({}, {sort: {score: -1}}).fetch()
});
