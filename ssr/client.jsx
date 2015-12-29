// Stolen from reactrouter:react-router-ssr

import React from 'react'
import ReactDOM from 'react-dom'
import * as history  from 'history'
import { Router } from 'react-router'

let ReactRouterSSR = {};

ReactRouterSSR.Run = function(routes, clientOptions) {
  if (!clientOptions) {
    clientOptions = {};
  }

  const history = clientOptions.history || history.useQueries(history.createHistory)();

  Meteor.startup(function() {
    const rootElementName = clientOptions.rootElement || 'react-app';
    let rootElement = document.getElementById(rootElementName);

    // In case the root element doesn't exist, let's create it
    if (!rootElement) {
      rootElement = document.createElement('div');
      rootElement.id = rootElementName;
      document.body.appendChild(rootElement);
    }

    // If using redux, create the store with the initial state sent by the server. 
    let reduxStore;
    if (typeof clientOptions.createReduxStore !== 'undefined') {
      const InjectData = Package['meteorhacks:inject-data'].InjectData;
      InjectData.getData('redux-initial-state', data => {
        const initialState = data ? JSON.parse(data) : undefined;
        reduxStore = clientOptions.createReduxStore(initialState, history);
      });
    }

    let app = (
      <Router
        history={history}
        children={routes}
        {...clientOptions.props} />
    );

    if (clientOptions.wrapper) {
      const wrapperProps = {};
      // Pass the redux store to the wrapper, which is supposed to be some
      // flavour of react-redux's <Provider>.
      if (reduxStore) {
        wrapperProps.store = reduxStore;
      }
      app = <clientOptions.wrapper {...wrapperProps}>{app}</clientOptions.wrapper>;
    }

    ReactDOM.render(app, rootElement);

    let collectorEl = document.getElementById(clientOptions.styleCollectorId || 'css-style-collector-data')

    if (collectorEl) {
      collectorEl.parentNode.removeChild(collectorEl);
    }
  });
};

export default ReactRouterSSR;