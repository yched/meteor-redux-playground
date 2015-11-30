import '../both/models/player';
import '../both/models/methods';
import store from './store/store';

let Provider = ReactRedux.Provider;
let DevTools = ReactReduxDevTools.DevTools;
let DebugPanel = ReactReduxDevTools.DebugPanel;
let LogMonitor = ReactReduxDevTools.LogMonitor;

Meteor.startup(function() {
  ReactDOM.render(
    <div>
      <Provider store={store}>
        <AppContainer />
      </Provider>
      { debugToolEnabled ?
        <DebugPanel top right bottom>
          <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
        : ''
      }
    </div>,
    document.getElementById('app'));
});
