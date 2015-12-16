import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import store from 'client/store/store';
import * as settings from 'settings.jsx';
import router from './router';

import 'both/models/methods';

Meteor.startup(function() {
  ReactDOM.render(
    <div>
      <Provider store={store}>
        {router}
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
