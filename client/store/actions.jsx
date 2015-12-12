import {createAction} from 'redux-actions';

export default {
  setPlayerView: createAction('SET_PLAYER_VIEW', viewName => (viewName)),
  selectPlayer: createAction('SELECT_PLAYER', playerId => playerId),
  // Side effect via redux-thunk
  incrementPlayerScore: (playerId, increment, callback) =>
    () => {Meteor.call('incrementPlayerScore', playerId, increment), callback},
  // Side effect via redux-thunk
  updatePlayerIndexes: (players, callback) =>
    () => {
      // Build the array of {_id, index} pairs.
      let indexesById = [];
      players.forEach((player, index) => {
        indexesById.push({_id: player._id, index});
      });
      Meteor.call('updatePlayerIndexes', indexesById, callback)
    }
}
