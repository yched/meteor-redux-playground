import React from 'react';
import { pure, setPropTypes } from 'recompose';
import { mapOf } from 'react-immutable-proptypes';
import { playerPropType } from './immutable_models/player';
import PlayerItem from './Player';
import DraggablePlayerItem from './DraggablePlayer';

@pure
@setPropTypes({
  players: mapOf(playerPropType).isRequired,
  selectedPlayer: playerPropType,
  playerView: React.PropTypes.string.isRequired,
  selectPlayer: React.PropTypes.func.isRequired
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
    // Call 'updateIndexes' Meteor method with the array of {_id, index} pairs.
    let data = [];
    this.getReorderedPlayers().forEach((player, index) => {
      data.push({_id: player._id, index});
    });
    Meteor.call('updateIndexes', data, () => this.endDragCallback());
  };

  endDragCallback = () => {
    this.setState({dragState: null});
  };

  getReorderedPlayers = () => {
    // Convert the map to a list.
    let players = this.props.players.toList();
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
      <ul className="leaderboard">
        {
          this.getReorderedPlayers().map((player, index) => (
            this.props.playerView === 'by_index' ?
              <DraggablePlayerItem
                key={ player._id }
                player={ player }
                isSelected={ this.props.selectedPlayer && this.props.selectedPlayer._id == player._id }
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
                isSelected={ this.props.selectedPlayer && this.props.selectedPlayer._id == player._id }
                selectPlayer={ this.props.selectPlayer }
              />
          ))
        }
      </ul>
    );
  };
}

export default PlayerList;

