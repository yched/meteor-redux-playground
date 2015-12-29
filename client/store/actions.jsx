import { createAction } from 'redux-actions'

// Change the router path.
export const pushPath = require('redux-simple-router').pushPath;

// Basic UI actions.
export const selectPlayer = createAction('SELECT_PLAYER', playerId => playerId);
export const setPlayerView = createAction('SET_PLAYER_VIEW', viewName => viewName);

// Track updates to a Mongo collection cursor.
export const trackMeteorCollection = createAction('TRACK_METEOR_COLLECTION', (subscriptions, collections) => ({subscriptions, collections}));

// Side effects (Meteor method calls) via redux-thunk (the action creator returns a function)
export const incrementPlayerScore = (playerId, increment, callback) =>
  () => Meteor.call('incrementPlayerScore', playerId, increment, callback);
export const updatePlayerIndexes = (players, callback) =>
  () => {
    // Build the array of {_id, index} pairs.
    let indexesById = [];
    players.forEach((player, index) => {
      indexesById.push({_id: player._id, index});
    });
    return Meteor.call('updatePlayerIndexes', indexesById, callback)
  };

// Async action
const fetchHttpStarted = createAction('FETCH_HTTP_STARTED', url => url);
const fetchHttpFinished = createAction('FETCH_HTTP_FINISHED', content => content);
// With redux-multi and redux-promise :
export const fetchHttp = url => [
  fetchHttpStarted(url),
  fetchHttpFinished(fetch(url).then(response => response.text()))
];
// Alternative with just redux-thunk : the thunk can receive the sore's 'dispatch' method.
//export const fetchHttp = url =>
//  dispatch => {
//    dispatch(fetchHttpStarted(url));
//    return fetch(url)
//      .then(response => response.text())
//      .then(content => dispatch(fetchHttpFinished(content)),
//            err => dispatch(fetchHttpFinished(err)));
//  };

