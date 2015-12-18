import React from 'react';
import ReactDOM from 'react-dom';
import Root from 'client/components/Root';
import * as settings from 'settings.jsx';
import store from 'client/store/store';
import routes from './routes';

import 'both/models/methods';

Meteor.startup(function() {
  ReactDOM.render(
    <Root store={store}
          routes={routes}
          debug={settings.debug} />,
    document.getElementById('app'));
});
