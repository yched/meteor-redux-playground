import React from 'react';
import { compose, pure } from 'recompose';

let Layout = props => (
  <div className="outer">

    <div className="logo"></div>
    <h1 className="title">Leaderboard</h1>
    <div className="subtitle">Select a scientist to give them points</div>

    {props.children}
  </div>
);

export default compose(
  pure
)(Layout);
