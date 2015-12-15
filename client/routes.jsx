import React from 'react';
import { Route } from 'react-router';
import AppContainer from 'client/containers/AppContainer';

export default (
  <Route path="/list/:listId" component={AppContainer}>
  </Route>
);


//<Route path="/" component={AppContainer}>
//  <Route path="about" component={About}/>
//  <Route path="users" component={Users}>
//    <Route path="/user/:userId" component={User}/>
//  </Route>
//  <Route path="*" component={NoMatch}/>
//</Route>
