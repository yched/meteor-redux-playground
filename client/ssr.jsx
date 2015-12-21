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

    let app = (
      <Router
        history={history}
        children={routes}
        {...clientOptions.props} />
    );

    if (clientOptions.wrapper) {
      app = <clientOptions.wrapper>{app}</clientOptions.wrapper>;
    }

    ReactDOM.render(app, rootElement);

    let collectorEl = document.getElementById(clientOptions.styleCollectorId || 'css-style-collector-data')

    if (collectorEl) {
      collectorEl.parentNode.removeChild(collectorEl);
    }
  });
};

export default ReactRouterSSR;
