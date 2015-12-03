import React from 'react';
import { compose, pure, setPropTypes } from 'recompose';
import { listOf, map } from 'react-immutable-proptypes';
import PlayerList from './PlayerList';
import SelectPlayer from './SelectPlayer';

const App = props => (
  <div className="outer">
    <div className="logo"></div>
    <h1 className="title">Leaderboard</h1>
    <div className="subtitle">Select a scientist to give them points</div>

    <div>
      <PlayerList players={props.players}
                  selectedId={props.selectedId}
                  selectPlayer={props.actions.selectPlayer}/>
    </div>

    <SelectPlayer selectedName={props.selectedName}
                  incrementScore={props.actions.incrementScore.bind(null, props.selectedId)} />

  </div>
);

export default compose(
  pure,
  setPropTypes({
    players: listOf(map).isRequired,
    selectedId: React.PropTypes.string.isRequired,
    selectedName: React.PropTypes.string.isRequired,

    actions: React.PropTypes.shape({
      selectPlayer: React.PropTypes.func.isRequired,
      incrementScore: React.PropTypes.func.isRequired,
    }).isRequired
  })
)(App);

