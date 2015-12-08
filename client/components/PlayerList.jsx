import React from 'react';
import { pure, setPropTypes } from 'recompose';
import { mapOf, map } from 'react-immutable-proptypes';
import PlayerItem from './Player';
import DraggablePlayerItem from './DraggablePlayer';

@pure
@setPropTypes({
  players: mapOf(map).isRequired,
  selectedId: React.PropTypes.string.isRequired,
  selectPlayer: React.PropTypes.func.isRequired
})
class PlayerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {dragPlayers: null};
  }

  dragCallback = (playerId, newIndex) => {
    // Store the dragging state.
    // Note : ça pourrait aussi aller dans le store...
    this.setState({
      dragState: {playerId, newIndex}
    });
  }

  dropCallback = () => {
    // Call 'updateIndexes' Meteor method with the array of {_id, index} pairs.
    let data = [];
    this.getReorderedPlayers().forEach((player, index) => {
      data.push({_id: player.get('_id'), index});
    });
    Meteor.call('updateIndexes', data, () => this.endDragCallback());
  }

  endDragCallback = () => {
    this.setState({dragState: null});
  }

  getReorderedPlayers = () => {
    // Convert the map to a list.
    let players = this.props.players.toList();
    // If dragging, reorder the list according to the current drag state.
    if (this.state.dragState) {
      const [prevIndex, player] = players.findEntry(player => player.get('_id') === this.state.dragState.playerId);
      // Remove the player from its previous position, and insert it at the new index.
      players = players.delete(prevIndex).splice(this.state.dragState.newIndex, 0, player);
      // @todo use withMutations to reduce the instanciations ?
      //players = players.withMutations(list => {list.delete(prevIndex).splice(this.state.dragState.newIndex, 0, player)});
    }
    return players;
  }

  render() {
    return (
      <ul className="leaderboard">
        {
          this.getReorderedPlayers().map((player, index) => {
          const playerId = player.get('_id');
          return (
            this.props.sort.get('field') === 'index' ?
              <DraggablePlayerItem
                key={ playerId }
                player={ player }
                selected={ this.props.selectedId == playerId }
                selectPlayer={ this.props.selectPlayer }
                index={index}
                dragCallback={ this.dragCallback }
                dropCallback={ this.dropCallback }
                endDragCallback={ this.endDragCallback }
              />
            :
              <PlayerItem
                key={ playerId }
                player={ player }
                selected={ this.props.selectedId == playerId }
                selectPlayer={ this.props.selectPlayer }
              />
            );
          })
        }
      </ul>
    );
  }
};

export default PlayerList;

