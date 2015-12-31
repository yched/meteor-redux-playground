import {createAction} from 'redux-actions';

// Adapted from skinnygeek1010:flux-helpers Meteor package :
// - defined as a middleware,
// - also pass the collection to the callback, so that we can use a single action for
//   all tracked collections.
const trackMeteorCollection = store => next => action => {
  if (action.type && action.type === 'TRACK_METEOR_COLLECTION') {
    const collections = action.payload;

    // Autorun is not available on the server, we fake one that only does a
    // single run and returns a fake stop() callback.
    const autorun = Meteor.isClient ? Tracker.autorun : (func => {func(); return {stop: () => {}}});

    const trackers = [];
    Object.keys(collections).map(collectionName => {
      const tracker = autorun(computation => {
        const args = collections[collectionName];
        // Note : fetch() is reactive.
        const docs = Mongo.Collection.get(collectionName).find(...args).fetch();
        //console.log('tracker', collectionName, docs);
        store.dispatch({
          'type': 'TRACK_METEOR_COLLECTION_UPDATE',
          payload: {
            collectionName,
            docs
          }
        });
      });
      trackers.push(tracker);
    });

    return {
      stopped: false,
      stop() {
        this.stopped = true;
        trackers.map(tracker => tracker.stop());
      }
    }
  }

  // Else ignore the action and just pass it through to the next middleware.
  return next(action);
};

export default trackMeteorCollection;
