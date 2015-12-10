import * as redux from 'redux';

let defaultEnhancers = [];
let defaultMiddleware = [];

// Let the caller pass arrays of middleware and enhancers, and take care
// of wrapping them around redux.createStore.
// Equivalent of :
// redux.applyMiddleware(m1, m2, m3)(e1(e2(e3)))(redux.createStore)(reducers)
function createStore(reducers, middleware, enhancers) {
  // Prepend default middleware and enhancers if any.
  middleware = defaultMiddleware.concat(middleware);
  enhancers = defaultEnhancers.concat(enhancers);

  // Apply middlewares.
  const middlewareStack = redux.applyMiddleware(...middleware);
  // Add enhancers, and compose them around redux.createStore : compose(f, g, h) = (x) => f(g(h(x)))
  const createStore = _.compose(middlewareStack, ...enhancers)(redux.createStore);

  // Do create the store.
  return createStore(reducers);
}

export default createStore;
