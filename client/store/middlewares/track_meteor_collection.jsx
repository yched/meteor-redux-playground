import {createAction} from 'redux-actions';

// Adapted from skinnygeek1010:flux-helpers Meteor package :
// - defined as a middleware,
// - allows tracking a specific request (Mongo Cursor)
// - also pass the collection to the callback, so that we can use a single action for
//   all tracked collections.
const trackMeteorCollection = store => next => action => {
  if (action.type && action.type === 'TRACK_METEOR_COLLECTION') {
    const {subscriptions, collections} = action.payload;

    let promise;

    // Autorun is not available on the server, we fake one that only does a
    // single run and returns a fake stop() callback.
    const autorun = Meteor.isClient ? Tracker.autorun : (func => {func(); return {stop: () => {}}});

    // @todo dispatch an action before subscribing ?
    const tracker = autorun(computation => {
      // Resolve the promise when the subscription is ready,
      // Reject it if an error occurs before that.
      const promises = [];
      for (let subscriptionName of Object.keys(subscriptions)) {
        const args = subscriptions[subscriptionName];
        promises.push(new Promise((resolve, reject) => {
          Meteor.subscribe(subscriptionName, ...args, {
            onReady: resolve,
            // @todo dispatch an action when stopped ?
            onStop: (err) => err && reject(err)
          })
        }));
      }

      promise = Promise.all(promises)
        .then(() => console.log('promise resolved'))
        .then(() => {
          for (let collectionName of Object.keys(collections)) {
            const data = collections[collectionName];
            const findArgs = Array.isArray(data) ? data : data.args;
            const findMethod = Array.isArray(data) ? 'find' : data.find;

            // Note : fetch() is reactive.
            const cursor = Meteor.Collection.get(collectionName)[findMethod](...findArgs);
            const docs = cursor.fetch();
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
