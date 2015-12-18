import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Layout from 'client/components/Layout';
import Navigation from 'client/components/Navigation';
import AppContainer from 'client/containers/AppContainer';

export default (
  <Route path="/" component={Layout}>
    <IndexRoute component={Navigation} />
    <Route path="list/:listId" component={AppContainer} />
  </Route>
);


//<Route path="/" component={AppContainer}>
//  <Route path="about" component={About}/>
//  <Route path="users" component={Users}>
//    <Route path="/user/:userId" component={User}/>
//  </Route>
//  <Route path="*" component={NoMatch}/>
//</Route>