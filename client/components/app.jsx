import React from 'react';
import { compose, pure, setPropTypes } from 'recompose';
import { mapOf } from 'react-immutable-proptypes';
import { playerPropType } from './immutable_models/player';
import PlayerList from './PlayerList';
import SelectPlayer from './SelectPlayer';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

const App = props => (
  <div className="outer">
    <div className="logo"></div>
    <h1 className="title">Leaderboard</h1>
    <div className="subtitle">Select a scientist to give them points</div>

    <input type="radio" name="sorting" defaultChecked={props.playerView === 'by_index'} onClick={() => props.actions.setPlayerView('by_index')} />
    Manual sort
    <input type="radio" name="sorting" defaultChecked={props.playerView === 'by_score'} onClick={() => props.actions.setPlayerView('by_score')} />
    Sort by scores

    <div>
      <PlayerList players={props.players}
                  selectedPlayer={props.selectedPlayer}
                  playerView={props.playerView}
                  selectPlayer={props.actions.selectPlayer} />
    </div>

    <SelectPlayer selectedPlayer={props.selectedPlayer}
                  incrementPlayerScore={props.incrementPlayerScore} />

  </div>
);

export default compose(
  DragDropContext(HTML5Backend),
  pure,
  setPropTypes({
    players: mapOf(playerPropType).isRequired,
    selectedId: React.PropTypes.string.isRequired,
    playerView: React.PropTypes.string.isRequired,
    selectedPlayer: playerPropType,

    actions: React.PropTypes.shape({
      selectPlayer: React.PropTypes.func.isRequired,
      setPlayerView: React.PropTypes.func.isRequired,
    }).isRequired
  })
)(App);

