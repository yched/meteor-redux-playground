import store from './store/store';

Provider = ReactRedux.Provider;
DevTools = ReactReduxDevTools.DevTools;
DebugPanel = ReactReduxDevTools.DebugPanel;
LogMonitor = ReactReduxDevTools.LogMonitor;
connect = ReactRedux.connect;

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
