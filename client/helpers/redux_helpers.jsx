import * as redux from 'redux';

// Let the caller pass arrays of middleware and enhancers, and take care
// of wrapping them around redux.createStore.
// Equivalent of :
// redux.applyMiddleware(m1, m2, m3)(e1(e2(e3)))(redux.createStore)
export default function createStoreWithEnhancers(middleware = [], enhancers = []) {
  // The middleware stack is the first enhancer.
  enhancers = [redux.applyMiddleware(...middleware), ...enhancers];
  // Compose enhancers into a single single wrapper.
  // compose(f, g, h)  =  (...args) => f(g(h(...args)))
  const wrapper = redux.compose(...enhancers);
  // Wrap it around the original redux.createStore.
  return wrapper(redux.createStore);
}
