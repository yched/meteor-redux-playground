import createLogger from 'redux-logger'
import * as Immutable from 'immutable';

let logger;

// Convert Immutables
const stateTransformer = (state) => {
  let newState = {};
  for (let i of Object.keys(state)) {
    if (Immutable.Iterable.isIterable(state[i])) {
      newState['[Immutable]' + i] = state[i].toJS();
    } else {
      newState[i] = state[i];
    }
  }
  return newState;
};

if (Meteor.isClient) {
  logger = createLogger({
    stateTransformer
  })
}
else {
  logger = store => next => action => {
    log('[Dispatching]', action);
    // essentially call 'dispatch'
    let result = next(action);
    log('[Store]', store.getState());
    return result;
  };

  function log() {
    console.log.apply(console, arguments);
  }
}

export default logger;
