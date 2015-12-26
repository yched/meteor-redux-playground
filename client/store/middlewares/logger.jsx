import createLogger from 'redux-logger'
import * as Immutable from 'immutable';


let options;

if (Meteor.isClient) {
  // Convert Immutables.
  const stateTransformer= (state) => {
    let newState = {};
    for (let i of Object.keys(state)) {
      const immutableTypes = ["Map", "OrderedMap", "List", "Seq", "Collection", "Stack", "Set", "OrderedSet", "Record", "Range", "Repeat", "Iterable"];
      const type = _.find(immutableTypes, type => Immutable[type] == state[i].constructor);
      if (type) {
        newState[`[Immutable:${type}]`+ i] = state[i].toJS();
      } else {
        newState[i] = state[i];
      }
    }
    return newState;
  };

  options = {
    duration: true,
    collapsed: true,
    logger: console,
    stateTransformer
  };
}
else {
  options = {
    duration: true,
    collapsed: true,
    logger: console,
    colors: false
  };
}

export default createLogger(options);
