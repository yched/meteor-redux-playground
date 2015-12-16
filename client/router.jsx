import React from 'react';
import { ReduxRouter } from 'redux-router';
import { Route } from 'react-router';
import AppContainer from 'client/containers/AppContainer';
import IndexContainer from 'client/containers/IndexContainer';

export default (
  <ReduxRouter>
    <Route path="/" component={IndexContainer} />
    <Route path="/list/:listId" component={AppContainer} />
  </ReduxRouter>
);


//<Route path="/" component={AppContainer}>
//  <Route path="about" component={About}/>
//  <Route path="users" component={Users}>
//    <Route path="/user/:userId" component={User}/>
//  </Route>
//  <Route path="*" component={NoMatch}/>
//</Route>
