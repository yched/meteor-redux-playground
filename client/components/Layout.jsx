import React from 'react';
import { compose, pure } from 'recompose';
import Helmet from 'react-helmet';

let Layout = props => (
  <div className="outer">

    <Helmet title="Meteor Leaderboard"
            link={[
              {rel: 'stylesheet', type: 'text/css', href: 'http://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600'}
            ]} />

    <div className="logo"></div>
    <h1 className="title">Leaderboard</h1>
    <div className="subtitle">Select a scientist to give them points</div>

    {props.children}
  </div>
);

export default compose(
  pure
)(Layout);
