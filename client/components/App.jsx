import React from 'react';
import { compose, pure, setPropTypes } from 'recompose';
import { mapOf } from 'react-immutable-proptypes';
import { playerPropType } from 'client/immutable_models/player';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PlayerList from './PlayerList';
import SelectPlayer from './SelectPlayer';
import { Link } from 'react-router'

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
                  selectPlayer={props.actions.selectPlayer}
                  updatePlayerIndexes={props.actions.updatePlayerIndexes} />
    </div>

    <SelectPlayer selectedPlayer={props.selectedPlayer}
                  incrementPlayerScore={props.actions.incrementPlayerScore} />

    <ul>
      {/* use Link to route around the app */}
      {[1, 2].map(listId => (
        <li key={listId}>
          {listId === props.listId ?
            <div>List {listId}</div> :
            <Link to={`/list/${listId}`}>List {listId}</Link>
          }
        </li>
      ))}
    </ul>

  </div>
);

export default compose(
  DragDropContext(HTML5Backend),
  pure,
  setPropTypes({
    listId: React.PropTypes.number.isRequired,
    players: mapOf(playerPropType).isRequired,
    playerView: React.PropTypes.string.isRequired,
    selectedPlayer: playerPropType,

    actions: React.PropTypes.shape({
      selectPlayer: React.PropTypes.func.isRequired,
      setPlayerView: React.PropTypes.func.isRequired,
      incrementPlayerScore: React.PropTypes.func.isRequired,
      updatePlayerIndexes: React.PropTypes.func.isRequired
    }).isRequired
  })
)(App);

