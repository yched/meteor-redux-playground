import {createAction} from 'redux-actions';

// Adapted from skinnygeek1010:flux-helpers Meteor package :
// - defined as a middleware,
// - allows tracking a specific request (Mongo Cursor)
// - also pass the collection to the callback, so that we can use a single action for
//   all tracked collections.
const trackMeteorCollection = store => next => action => {
  if (action.type && action.type === 'TRACK_METEOR_COLLECTION') {
    const collections = action.payload;

    // Autorun is not available on the server, we fake one that only does a
    // single run and returns a fake stop() callback.
    const autorun = Meteor.isClient ? Tracker.autorun : (func => {func(); return {stop: () => {}}});

    const trackers = [];
    // @todo dispatch an action before subscribing ?
    for (let collectionName of Object.keys(collections)) {
      const tracker = autorun(computation => {
        const data = collections[collectionName];
        const findArgs = Array.isArray(data) ? data : data.args;
        const findMethod = Array.isArray(data) ? 'find' : data.find;
        const docs = Mongo.Collection.get(collectionName)[findMethod](...findArgs).fetch();
        console.log('tracker', collectionName, docs);
        // @todo on ne recoit pas les updates suivants...
        // Note : fetch() is reactive.
        // @todo On trouve *tous* les players à ce moment...
        store.dispatch({
          'type': 'TRACK_METEOR_COLLECTION_UPDATE',
          payload: {
            collectionName,
            docs
          }
        });
      });
      trackers.push(tracker);
    }

    return {
      stopped: false,
      stop() {
        trackers.map(tracker => tracker.stop());
        this.stopped = true;
      }
    }
  }

  // Else ignore the action and just pass it through to the next middleware.
  return next(action);
};

export default trackMeteorCollection;
