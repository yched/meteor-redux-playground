// Stolen from reactrouter:react-router-ssr
// With an additional serverOptions.appendCallback option to add
// window.__INITIAL_STATE__ to the returned HTML.

// meteor algorithm to check if this is a meteor serving http request or not
function IsAppUrl(req) {
  var url = req.url
  if (url === '/favicon.ico' || url === '/robots.txt') {
    return false;
  }

  // NOTE: app.manifest is not a web standard like favicon.ico and
  // robots.txt. It is a file name we have chosen to use for HTML5
  // appcache URLs. It is included here to prevent using an appcache
  // then removing it from poisoning an app permanently. Eventually,
  // once we have server side routing, this won't be needed as
  // unknown URLs with return a 404 automatically.
  if (url === '/app.manifest') {
    return false;
  }

  // Avoid serving app HTML for declared routes such as /sockjs/.
  //if (RoutePolicy.classify(url)) {
  //  return false;
  //}
  return true;
}

import React from 'react'
import ReactDOMServer from 'node_modules/react-dom/server'
import { RoutingContext, match } from 'react-router'
import * as history from 'history'
import cookieParser from 'cookie-parser'
import Helmet from 'react-helmet'

let webpackStats;

let ReactRouterSSR = {};

ReactRouterSSR.LoadWebpackStats = function(stats) {
  webpackStats = stats;
};

ReactRouterSSR.Run = function(routes, clientOptions, serverOptions) {
  if (!clientOptions) {
    clientOptions = {};
  }

  if (!serverOptions) {
    serverOptions = {};
  }

  if (!serverOptions.webpackStats) {
    serverOptions.webpackStats = webpackStats;
  }

  Meteor.bindEnvironment(function() {
    // Parse cookies for the login token
    WebApp.rawConnectHandlers.use(cookieParser());

    WebApp.connectHandlers.use(Meteor.bindEnvironment(function(req, res, next) {
      if (!IsAppUrl(req)) {
        next();
        return;
      }

      global.__CHUNK_COLLECTOR__ = [];

      var loginToken = req.cookies['meteor_login_token'];
      var headers = req.headers;
      var context = new FastRender._Context(loginToken, { headers });

      const originalUserId = Meteor.userId;
      const originalUser = Meteor.user;

      // This should be the state of the client when he remount the app
      Meteor.userId = () => context.userId;
      Meteor.user = () => undefined;

      // On the server, no route should be async (I guess we trust the app)
      match({ routes, location: req.url }, Meteor.bindEnvironment((err, redirectLocation, renderProps) => {
        console.log('----------------------------------------------------');
        if (err) {
          res.writeHead(500);
          res.write(err.messages);
          res.end();
        } else if (redirectLocation) {
          res.writeHead(302, { Location: redirectLocation.pathname + redirectLocation.search })
          res.end();
        } else if (renderProps) {
          console.log('route match', renderProps.location.pathname, renderProps.params);
          if (typeof serverOptions.createReduxStore !== 'undefined') {
            const myHistory = history.useQueries(history.createMemoryHistory)();
            myHistory.replace(req.url);
            serverOptions.reduxStore = serverOptions.createReduxStore(myHistory);
          }
          sendSSRHtml(clientOptions, serverOptions, context, req, res, next, renderProps);
        } else {
          res.writeHead(404);
          res.write('Not found');
          res.end();
        }
      }));

      Meteor.userId = originalUserId;
      Meteor.user = originalUser;
    }));
  })();
};

function sendSSRHtml(clientOptions, serverOptions, context, req, res, next, renderProps) {
  const { css, html, head } = generateSSRData(serverOptions, context, req, res, renderProps);
  res.write = patchResWrite(clientOptions, serverOptions, res.write, css, html, head);

  next();
}

function patchResWrite(clientOptions, serverOptions, originalWrite, css, html, head) {
  return function(data) {
    if (typeof data === 'string' && data.indexOf('<!DOCTYPE html>') === 0) {
      if (!serverOptions.dontMoveScripts) {
        data = moveScripts(data);
      }

      if (css) {
        data = data.replace('</head>', '<style id="' + (clientOptions.styleCollectorId || 'css-style-collector-data') + '">' + css + '</style></head>');
      }

      if (head) {
        // Add react-helmet stuff in the header (yay SEO!)
        data = data.replace('<head>',
          '<head>' + head.title + head.base + head.meta + head.link + head.script
        );
      }

      data = data.replace('<body>', '<body><div id="' + (clientOptions.rootElement || 'react-app') + '">' + html + '</div>');

      if (typeof serverOptions.webpackStats !== 'undefined') {
        data = addAssetsChunks(serverOptions, data);
      }

      // After rendering was done, pass the resulting store state to the client
      // so that he can start from there.
      // @todo use res.pushData in generateSSRData() instead ?
      if (typeof serverOptions.reduxStore !== 'undefined') {
        data = data.replace('</body>', `<script>window.__INITIAL_STATE__ = ${JSON.stringify(serverOptions.reduxStore.getState())}</script></body>`);
      }
    }

    originalWrite.call(this, data);
  }
}

function addAssetsChunks(serverOptions, data) {
  const chunkNames = serverOptions.webpackStats.assetsByChunkName;
  const publicPath = serverOptions.webpackStats.publicPath;

  if (typeof chunkNames.common !== 'undefined') {
    var chunkSrc = (typeof chunkNames.common === 'string')?
      chunkNames.common :
      chunkNames.common[0];

    data = data.replace('<head>', '<head><script type="text/javascript" src="' + publicPath + chunkSrc + '"></script>');
  }

  for (var i = 0; i < global.__CHUNK_COLLECTOR__.length; ++i) {
    if (typeof chunkNames[global.__CHUNK_COLLECTOR__[i]] !== 'undefined') {
      var chunkSrc = (typeof chunkNames[global.__CHUNK_COLLECTOR__[i]] === 'string')?
        chunkNames[global.__CHUNK_COLLECTOR__[i]] :
        chunkNames[global.__CHUNK_COLLECTOR__[i]][0];

      data = data.replace('</head>', '<script type="text/javascript" src="' + publicPath + chunkSrc + '"></script></head>');
    }
  }

  return data;
}

function generateSSRData(serverOptions, context, req, res, renderProps) {
  let html, css, head;

  try {
    FastRender.frContext.withValue(context, function() {
      const originalSubscribe = Meteor.subscribe;
      Meteor.subscribe = SSRSubscribe(context);

      if (Package.mongo && !Package.autopublish) {
        Mongo.Collection._isSSR = true;
        Mongo.Collection._publishSelectorsSSR = {};
      }

      if (serverOptions.preRender) {
        serverOptions.preRender(req, res);
      }

      global.__STYLE_COLLECTOR_MODULES__ = [];
      global.__STYLE_COLLECTOR__ = '';

      renderProps = {
        ...renderProps,
        ...serverOptions.props
      };

      let app = <RoutingContext {...renderProps} />;

      if (serverOptions.wrapper) {
        const wrapperProps = {};
        if (typeof serverOptions.reduxStore !== 'undefined') {
          wrapperProps.store = serverOptions.reduxStore;
        }
        app = <serverOptions.wrapper {...wrapperProps}>{app}</serverOptions.wrapper>;
      }

      html = ReactDOMServer.renderToString(app);

      head = Helmet.rewind();

      css = global.__STYLE_COLLECTOR__;

      if (serverOptions.postRender) {
        serverOptions.postRender(req, res);
      }

      // Pass the resulting redux state to the client.
      //if (typeof serverOptions.reduxStore !== 'undefined') {
      //  res.pushData('redux-initial-state', serverOptions.reduxStore.getState());
      //}

      Meteor.subscribe = originalSubscribe;

      if (Package.mongo && !Package.autopublish) {
        Mongo.Collection._isSSR = false;
      }
    });

    res.pushData('fast-render-data', context.getData());
  } catch(err) {
    console.error('error while server-rendering', err.stack);
  }

  return { html, css, head };
}

function SSRSubscribe(context) {
  return function(name, ...args) {
    if (Package.mongo && !Package.autopublish) {
      Mongo.Collection._isSSR = false;
      const publishResult = Meteor.server.publish_handlers[name].apply(context, args);
      Mongo.Collection._isSSR = true;

      Mongo.Collection._fakePublish(publishResult);
    }

    context.subscribe.apply(context, arguments);

    return {
      stop() {}, // Nothing to stop on server-rendering
      ready() { return true; } // server gets the data straight away
    };
  }
}

// Thank you FlowRouter for this wonderful idea :)
// https://github.com/kadirahq/flow-router/blob/ssr/server/route.js
const Cheerio = Npm.require('cheerio');

function moveScripts(data) {
  const $ = Cheerio.load(data, {
    decodeEntities: false
  });
  const heads = $('head script');
  $('body').append(heads);

  // Remove empty lines caused by removing scripts
  $('head').html($('head').html().replace(/(^[ \t]*\n)/gm, ''));

  return $.html();
}

if (Package.mongo && !Package.autopublish) {
  // Protect against returning data that has not been published
  const originalFind = Mongo.Collection.prototype.find;
  const originalFindOne = Mongo.Collection.prototype.findOne;

  Mongo.Collection.prototype.findOne = function() {
    let args = Array.prototype.slice.call(arguments);

    if (!Mongo.Collection._isSSR) {
      return originalFindOne.apply(this, args);
    }

    // Make sure to return nothing if no publish has been called
    if (!Mongo.Collection._publishSelectorsSSR[this._name] || !Mongo.Collection._publishSelectorsSSR[this._name].length) {
      return originalFindOne.apply(this, [undefined]);
    }

    if (args.length) {
      if (typeof args[0] === 'string') {
        args[0] = { _id: args[0] };
      }

      args[0] = { $and: [args[0], { $or: Mongo.Collection._publishSelectorsSSR[this._name] }] };
    } else {
      args.push({ $or: Mongo.Collection._publishSelectorsSSR[this._name] });
    }
    return originalFindOne.apply(this, args);
  };

  Mongo.Collection.prototype.find = function() {
    let args = Array.prototype.slice.call(arguments);

    if (!Mongo.Collection._isSSR) {
      return originalFind.apply(this, args);
    }

    // Make sure to return nothing if no publish has been called
    if (!Mongo.Collection._publishSelectorsSSR[this._name] || !Mongo.Collection._publishSelectorsSSR[this._name].length) {
      return originalFind.apply(this, [undefined]);
    }

    if (args.length) {
      args[0] = { $and: [args[0], { $or: Mongo.Collection._publishSelectorsSSR[this._name] }] };
    } else {
      args.push({ $or: Mongo.Collection._publishSelectorsSSR[this._name] });
    }
    return originalFind.apply(this, args);;
  };

  Mongo.Collection._fakePublish = function(result) {
    if (Array.isArray(result)) {
      result.forEach(subResult => Mongo.Collection._fakePublish(subResult));
      return;
    }

    const name = result._cursorDescription.collectionName;
    const selector = result._cursorDescription.selector;

    if (!Mongo.Collection._publishSelectorsSSR[name]) {
      Mongo.Collection._publishSelectorsSSR[name] = [];
    }

    Mongo.Collection._publishSelectorsSSR[name].push(selector);
  };
}

export default ReactRouterSSR;
