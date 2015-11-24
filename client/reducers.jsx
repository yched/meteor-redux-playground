// reducers allow you to 'slice' off a part of the single state object which
// lets you think about the domain in a smaller picture. You could use one
// reducer in a small app like this but in large apps this reducer could be
// several hundred lines. See store.jsx to see how these reducers get 'combined'
// into one single app state. We'll use two reducers, one for transient state
// that the UI uses (selected id,name) and one for data (coming from Mongo)


// these reducers *must* be pure to use time-travel dev-tools
// never directly mutate the `state` param, use merge instead
Reducers = {
  userInterface(state = {}, action) {
    switch (action.type) {
      case 'SELECT_PLAYER':
        // we happen to be replacing all the reducers state but with merge you
        // could just return the selectedId and it would retain selectedPlayerName
        return _.extend({}, state, {
          selectedId: action.playerId,
        });
      default:
        return state;
    }
  },
  // using the ES6 default params instead of the manual check like above
  collections(state = {}, action) {
    switch (action.type) {
      case 'COLLECTION_CHANGED':
        // Place a duplicate of the collection in the store...
        // @Todo Shaky...
        let c = new Mongo.Collection(null);
        action.collection.find().forEach(function(record) {
          c.insert(record);
        });
        let newState = {};
        newState[action.collection._name] = c;
        return _.extend({}, state, newState);
      default:
        return state;
    }
  }
};




