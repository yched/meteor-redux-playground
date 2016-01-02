import React from 'react';
import { pure, setPropTypes } from 'recompose';
import { listOf } from 'react-immutable-proptypes';
import ImmutableModels from 'client/immutable_models';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Helmet from 'react-helmet';
import PlayerList from './PlayerList';
import SelectPlayer from './SelectPlayer';
import Navigation from './Navigation';

@DragDropContext(HTML5Backend)
@pure
@setPropTypes({
  listId: React.PropTypes.string.isRequired,
  playerView: React.PropTypes.string.isRequired,
  playersList: listOf(ImmutableModels.player.propType).isRequired,
  selectedPlayer: ImmutableModels.player.propType,
  //playersLoaded: React.PropTypes.bool.isRequired,

  actions: React.PropTypes.shape({
    setPlayerView: React.PropTypes.func.isRequired,
    selectPlayer: React.PropTypes.func.isRequired,
    incrementPlayerScore: React.PropTypes.func.isRequired,
    movePlayer: React.PropTypes.func.isRequired
  }).isRequired
})
class App extends React.Component {
  render() {
    const props = this.props;
    const url = 'http://drupal.org';
    return (
      <div>
        <Helmet title={`Meteor Leaderboard - List ${props.listId}`} />

        <Navigation listId={props.listId} />

        <input type="radio" name="sorting" defaultChecked={props.playerView === 'by_index'} onClick={() => props.actions.setPlayerView('by_index')} />
        Manual sort
        <input type="radio" name="sorting" defaultChecked={props.playerView === 'by_score'} onClick={() => props.actions.setPlayerView('by_score')} />
        Sort by scores

        <div>
          <PlayerList listId={props.listId}
                      players={props.playersList}
                      selectedPlayer={props.selectedPlayer}
                      playerView={props.playerView}
                      selectPlayer={props.actions.selectPlayer}
                      movePlayer={props.actions.movePlayer}/>

          <SelectPlayer selectedPlayer = {props.selectedPlayer}
                        incrementPlayerScore={props.actions.incrementPlayerScore} />
        </div>

        <form onSubmit={e => {e.preventDefault(); props.actions.fetchHttp(this.refs.urlInput.value)}}>
          <input ref="urlInput" defaultValue="http://drupal.org"/>&nbsp;
          <button>HTTP request</button>
        </form>
        <br/>
        {props.remoteData.get('error') ? props.remoteData.get('error') :
           (props.remoteData.get('fetching') ? 'fetching: ' + this.refs.urlInput.value :
             (props.remoteData.get('data') ? props.remoteData.get('data') : ''))}
      </div>
    )
  }
}

export default App;
