import {createAction} from 'redux-actions';

// Adapted from skinnygeek1010:flux-helpers Meteor package :
// - defined as a middleware,
// - allows tracking a specific request (Mongo Cursor)
// - also pass the collection to the callback, so that we can use a single action for
//   all tracked collections.
const trackMeteorCollection = store => next => action => {
  if (action.type && action.type === 'TRACK_METEOR_COLLECTION') {
    const {subscribe, cursor} = action.payload;
    let tracker;

    // Build a promise that resolves when the subscription is ready.
    const promise = new Promise((resolve, reject) => {

      // Autorun is not available on the server, we fake one that only does a
      // single run and returns a fake stop() callback.
      const autorun = Meteor.isClient ? Tracker.autorun : (func => {func(); return {stop: () => {}}});

      // @todo dispatch an action before subscribing ?
      tracker = autorun(computation => {
        // Resolve the promise when the subscription is ready,
        // Reject it if an error occurs before that.
        const subscription = Meteor.subscribe(...subscribe, {
          onReady: resolve,
          // @todo dispatch an action when stopped ?
          onStop: (err) => err && reject(err)
        });

        // Once the subscription is ready, dispatch the 'UPDATE' event on each change.
        // Note : ready() is reactive.
        if (subscription.ready()) {
          // Now evaluate the cursor.
          const realCursor = cursor();
          const collectionName = Meteor.isClient ? realCursor.collection.name : realCursor._cursorDescription.collectionName;
          // Note : fetch() is reactive.
          const docs = realCursor.fetch();
          store.dispatch({
            'type': 'TRACK_METEOR_COLLECTION_UPDATE',
            payload: {collectionName, docs}
          });
        }
      });
    });

    return {
      // @todo promise is never resolved on the server ??
      promise: Promise.resolve(), //.then(() => console.log('promise resolved')),
      tracker
    }
  }

  // Else ignore the action and just pass it through to the next middleware.
  return next(action);
};

export default trackMeteorCollection;
