import React from 'react';
import ReactDOM from 'react-dom';
import store from 'client/store/store';
import { Provider } from 'react-redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { ReduxRouter } from 'redux-router';
import * as settings from 'settings.jsx';
import routes from './routes';

import 'both/models/methods';

Meteor.startup(function() {
  ReactDOM.render(
    <div>
      <Provider store={store}>
        <ReduxRouter>
          {routes}
        </ReduxRouter>
      </Provider>
      { settings.debug ?
        <DebugPanel top right bottom>
          <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
        : ''
      }
    </div>,
    document.getElementById('app'));
});
