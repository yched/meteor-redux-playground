import React from 'react';
import { pure, setPropTypes } from 'recompose';
import { listOf } from 'react-immutable-proptypes';
import { visualizeRender } from 'client/helpers/react_helpers';
import ImmutableModels from 'client/immutable_models';
import PlayerItem from './Player';
import DraggablePlayerItem from './DraggablePlayer';
import SelectPlayer from './SelectPlayer';

@visualizeRender
@pure
@setPropTypes({
  listId: React.PropTypes.string.isRequired,
  players: listOf(ImmutableModels.player.propType).isRequired,
  selectedPlayer: ImmutableModels.player.propType,
  playerView: React.PropTypes.string.isRequired,
  selectPlayer: React.PropTypes.func.isRequired,
  movePlayer: React.PropTypes.func.isRequired
})
class PlayerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {dragState: null};
  };

  dragCallback = (playerId, newIndex) => {
    // Store the dragging state.
    // Note : ça pourrait aussi aller dans le store...
    this.setState({
      dragState: {playerId, newIndex}
    });
  };

  dropCallback = () => {
    // Dispatch the movePlayer action. The endDragCallback is passed as a callback for the
    // Meteor method call, to avoid UI flickering.
    this.props.movePlayer(this.props.listId, this.state.dragState.playerId, this.state.dragState.newIndex, this.endDragCallback);
  };

  endDragCallback = () => {
    this.setState({dragState: null});
  };

  getReorderedPlayers = () => {
    let players = this.props.players;
    // If dragging, reorder the list according to the current drag state.
    if (this.state.dragState) {
      const [prevIndex, player] = players.findEntry(player => player._id === this.state.dragState.playerId);
      // Remove the player from its previous position, and insert it at the new index.
      players = players.delete(prevIndex).splice(this.state.dragState.newIndex, 0, player);
    }
    return players;
  };

  render() {
    return (
      <div>

        <input type="radio" name="sorting" defaultChecked={this.props.playerView === 'by_index'} onClick={() => this.props.setPlayerView('by_index')} />
        Manual sort
        <input type="radio" name="sorting" defaultChecked={this.props.playerView === 'by_score'} onClick={() => this.props.setPlayerView('by_score')} />
        Sort by scores

        <ul className="leaderboard">
          {
            this.getReorderedPlayers().map((player, index) => (
              this.props.playerView === 'by_index' ?
                <DraggablePlayerItem
                  key={ player._id }
                  player={ player }
                  isSelected={ this.props.selectedPlayer ? this.props.selectedPlayer._id === player._id : false}
                  selectPlayer={ this.props.selectPlayer }
                  index={index}
                  dragCallback={ this.dragCallback }
                  dropCallback={ this.dropCallback }
                  endDragCallback={ this.endDragCallback }
                />
              :
                <PlayerItem
                  key={ player._id }
                  player={ player }
                  isSelected={ this.props.selectedPlayer ? this.props.selectedPlayer._id === player._id : false }
                  selectPlayer={ this.props.selectPlayer }
                />
            ))
          }
        </ul>

        <SelectPlayer selectedPlayer={this.props.selectedPlayer}
                      incrementPlayerScore={this.props.incrementPlayerScore} />
      </div>
    );
  };
}

export default PlayerList;

