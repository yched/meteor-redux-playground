import '../both/models/player';
import '../both/models/methods';

import store from './store/store';
import AppContainer from './components/AppContainer';
import { Provider } from 'react-redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

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
