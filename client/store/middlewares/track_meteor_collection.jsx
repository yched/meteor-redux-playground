import {createAction} from 'redux-actions';

// Adapted from skinnygeek1010:flux-helpers Meteor package :
// - defined as a middleware,
// - allows tracking a specific request (Mongo Cursor)
// - also pass the collection to the callback, so that we can use a single action for
//   all tracked collections.
const trackMeteorCollection = store => next => action => {
  // If the payload is a Mongo Cursor.
  if (action.payload && (action.payload instanceof Mongo.Cursor || action.payload instanceof Mongo.Collection)) {
    // If we were passed a collection, track all docs.
    // If we were passed directly a cursor, track that cursor.
    const cursor = (action.payload instanceof Mongo.Collection) ? action.payload.find() : action.payload;
    // Track the cursor to trigger the action on change.
    // We return the Tracker computation so that the caller can call stop() on it to stop tracking.
    return Tracker.autorun(function (computation) {
      // fetch() on the cursor to trigger autorun.
      store.dispatch({...action, payload: {docs: cursor.fetch(), cursor}});
    });
  }
  // Else just pass the action through.
  else {
    return next(action);
  }
};

export default trackMeteorCollection;
