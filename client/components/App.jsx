import React from 'react';
import { pure, setPropTypes } from 'recompose';
import { mapOf } from 'react-immutable-proptypes';
import { playerPropType } from 'client/immutable_models/player';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PlayerList from './PlayerList';
import SelectPlayer from './SelectPlayer';
import { Link } from 'react-router'
import Players from 'both/models/player';

@DragDropContext(HTML5Backend)
@pure
@setPropTypes({
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
class App extends React.Component {

  // Subscribe to the Players publication, and track reactive changes.
  componentWillMount() {
    this._subscribeToPlayers(this.props.playerView, {listId: this.props.listId});
  }

  // Re-subscribe if the view changed.
  componentWillReceiveProps(nextProps) {
    if (nextProps.playerView !== this.props.playerView || nextProps.listId !== this.props.listId) {
      this._subscribeToPlayers(nextProps.playerView, {listId: nextProps.listId});
    }
  }

  _subscribeToPlayers(viewName, params) {
    // Subscribe to 'players' publication, with the current view.
    this.sub = Meteor.subscribe('players', viewName, params);
    // Track the Minimongo cursor on the request we're interested in.
    this.track && this.track.stop();
    this.track = this.props.actions.trackPlayerCollection(Players.getCursor(viewName, params));
  }

  componentWillUnmount() {
    // Unsubscribe to 'players' publication.
    this.sub.stop();
    // Stop tracking the request.
    this.track.stop();
  }

  render() {
    const props = this.props;
    return (
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
          {[1, 2].map(listId => (
            <li key={listId}>
              {listId !== props.listId ?
                <Link to={`/list/${listId}`}>List {listId}</Link> :
                <div>List {listId}</div>
              }
            </li>
          ))}
        </ul>

      </div>
    )
  }
}

export default App;

