import {createAction} from 'redux-actions';

// Adapted from skinnygeek1010:flux-helpers Meteor package :
// - defined as a middleware,
// - allows tracking a specific request (Mongo Cursor)
// - also pass the collection to the callback, so that we can use a single action for
//   all tracked collections.
const trackMeteorCollection = store => next => action => {
  // If the payload is a Mongo Cursor or Collection
  // @todo "instanceof Mongo.Cursor" doesn't work on the server ??
  //if (action.payload && (action.payload instanceof Mongo.Cursor || action.payload instanceof Mongo.Collection)) {
  if (action.payload && (typeof action.payload.fetch === 'function' || typeof action.payload.find === 'function')) {
    // If we were passed a collection, track all content.
    // If we were passed directly a cursor, track that cursor.
    const cursor = (action.payload instanceof Mongo.Collection) ? action.payload.find() : action.payload;

    // On the client, track the cursor to dispatch the action on change.
    // We return the Tracker computation so that the caller can call stop() on it to stop tracking.
    if (Meteor.isClient) {
      return Tracker.autorun(function (computation) {
        // fetch() on the cursor triggers autorun.
        store.dispatch({...action, payload: {docs: cursor.fetch(), cursor}});
      });
    }
    // When doing serever-side rendering, we don't want to track anything.
    // Just dispatch the docs once right away, and return a dummy stop() function.
    store.dispatch({...action, payload: {docs: cursor.fetch(), cursor}});
    return () => {};
  }

  // Else ignore the action and just pass it through to the next middleware.
  return next(action);
};

export default trackMeteorCollection;
