// action creators are functions that take a param and return
// an 'action' that is consumed by a reducer. This may seem like
// unneeded boilerplate  but it's **really** nice to have a file
// with *all* possible ways to mutate the state of the app.

Actions = {
  // used when a mongo players collection changes
  playersChanged(newDocs) {
    return {
      type: 'PLAYERS_COLLECTION_CHANGED',
      collection: newDocs
    };
  },

  // doesn't return payload because our collection watcher
  // will send a CHANGED action and update the store
  incrementScore(playerId) {
    Meteor.call('incrementScore', playerId, 5);
    // TODO call FAILED action on error
    return {type: 'INCREMENT_SCORE'};
  },

  selectPlayer(playerId) {
    return {
      type: 'SELECT_PLAYER',
      playerId: playerId
    };
  }
}
