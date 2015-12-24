import { createHistory } from 'history'
import { withProps } from 'recompose'

import ReactRouterSSR from '../ssr/client'
import Root from 'client/containers/Root'
import createReduxStore from 'client/store/store'
import routes from './routes'
import * as settings from 'settings.jsx'

import 'both/models/methods'

Meteor.startup(() => {

  // Enable devTools if applicable.
  const devTools = settings.debug && process.env.NODE_ENV !== 'production';

  // Do the rendering (note : this works even if SSR is not enabled on the server-side)
  ReactRouterSSR.Run(routes, {
    wrapper: withProps({devTools}, Root),
    history: createHistory(),
    createReduxStore
  });

});


