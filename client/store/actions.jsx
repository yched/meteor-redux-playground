import { createAction } from 'redux-actions'
import { pushPath } from 'redux-simple-router'

export default {
  // Change the router path.
  pushPath,

  // Track updtaes to a Mongo collection cursor.
  trackPlayerCollection: createAction('TRACK_PLAYER_COLLECTION', cursor => cursor),

  selectPlayer: createAction('SELECT_PLAYER', playerId => playerId),
  setPlayerView: createAction('SET_PLAYER_VIEW', viewName => viewName),

  // Optimistic async action: with redux-multi and redux-promise
  // Dispatch 2 actions (redux-multi) :
  //fetchHttp: url => [
  //  // - a regular 'STARTED' action,
  //  {type: 'FETCH_HTTP_STARTED', payload: url},
  //  // - an async action (redux-promise), with a Promise as payload
  //  {type: 'FETCH_HTTP_FINISHED', payload: fetch(url).then(response => response.text())},
  //  // Alternate, more explicit : redux-promise allows to dispatch the Promise directly, but we need to
  //  // handle error explicitly.
  //  //fetch(url)
  //  //  .then(response => response.text())
  //  //  .then(content => ({type: 'FETCH_HTTP_FINISHED', payload: content}))
  //  //  .catch(err => ({type: 'FETCH_HTTP_FINISHED', payload: err, error: true}))
  //],

  // Alternative with just redux-thunk :
  fetchHttp: url =>
    dispatch => {
      const fetchHttpStarted = createAction('FETCH_HTTP_STARTED', url => url);
      const fetchHttpFinished = createAction('FETCH_HTTP_FINISHED', content => content);
      dispatch(fetchHttpStarted(url));
      fetch(url)
        .then(response => response.text())
        .then(content => dispatch(fetchHttpFinished(content)))
        .catch(err => dispatch(fetchHttpFinished(err)));
    },

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
