// action creators are functions that take a param and return
// an 'action' that is consumed by a reducer. This may seem like
// unneeded boilerplate  but it's **really** nice to have a file
// with *all* possible ways to mutate the state of the app.
CollectionActions = {
  collectionChanged(collection) {
    return {
      type: 'COLLECTION_CHANGED',
      collection,
    };
  }
}

Actions = {
  // doesn't return payload because our collection watcher
  // will send a CHANGED action and update the store
  incrementScore(playerId, increment) {
    Meteor.call('incrementScore', playerId, increment);
    // Note : no reducer catches this action to modify the store.
    // normally in redux you would update and merge state here but
    // since have minimongo to do that for us we'll just wait for the
    // flux-helper to dispatch a COLLECTION_CHANGED after the
    // increment update. Since we're doing that we'll just return the old
    // state to prevent the UI from re-rendering twice.
    // TODO call FAILED action on error
    return {
      type: 'INCREMENT_SCORE',
      playerId,
      increment
    };
  },

  selectPlayer(playerId) {
    return {
      type: 'SELECT_PLAYER',
      playerId
    };
  }
}
