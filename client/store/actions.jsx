import {createAction} from 'redux-actions';
import { pushPath } from 'redux-simple-router'

export default {
  // Change the router path.
  pushPath,

  // Track updtaes to a Mongo collection cursor.
  trackPlayerCollection: createAction('TRACK_PLAYER_COLLECTION', cursor => cursor),

  selectPlayer: createAction('SELECT_PLAYER', playerId => playerId),
  setPlayerView: createAction('SET_PLAYER_VIEW', viewName => viewName),


  // Side effect (Meteor method call) via redux-thunk
  incrementPlayerScore: (playerId, increment, callback) =>
    () => Meteor.call('incrementPlayerScore', playerId, increment, callback),

  // Side effect (Meteor method call) via redux-thunk
  updatePlayerIndexes: (players, callback) =>
    () => {
      // Build the array of {_id, index} pairs.
      let indexesById = [];
      players.forEach((player, index) => {
        indexesById.push({_id: player._id, index});
      });
      return Meteor.call('updatePlayerIndexes', indexesById, callback)
    }
}
