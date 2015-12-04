import React from 'react';
import ReactDOM from 'react-dom';
import store from './store/store';
import { Provider } from 'react-redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import AppContainer from './components/AppContainer';

import '../both/models/player';
import '../both/models/methods';

Meteor.startup(function() {
  ReactDOM.render(
    <div>
      <Provider store={store}>
        <AppContainer />
      </Provider>
      { false ?
        <DebugPanel top right bottom>
          <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
        : ''
      }
    </div>,
    document.getElementById('app'));
});
