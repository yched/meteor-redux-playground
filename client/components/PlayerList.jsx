import React from 'react';
import { compose, pure, setPropTypes } from 'recompose';
import { listOf, map } from 'react-immutable-proptypes';
import PlayerItem from './Player';
import DraggablePlayerItem from './DraggablePlayer';


const PlayerList = React.createClass({
  getInitialState() {
    return {
      dragPlayers: null
    }
  },

  dragCallback(playerId, newIndex) {
    // Store the dragging state.
    // Note : ça pourrait aussi aller dans le store...
    this.setState({
      dragState: {playerId, newIndex}
    });
  },

  dropCallback() {
    // Call 'updateIndexes' Meteor method with the array of {_id, index} pairs.
    let data = [];
    this.getReorderedPlayers().forEach(player => {
      data.push({_id: player.get('_id'), index: player.get('index')});
    });
    Meteor.call('updateIndexes', data, () => this.endDragCallback());
  },

  endDragCallback() {
    this.setState({dragState: null});
  },

  getReorderedPlayers() {
    let players = this.props.players;
    // If dragging, reorder the list according to the current drag state.
    if (this.state.dragState) {
      // Remove the player from its previous position.
      const [prevIndex, player] = players.findEntry(player => player.get('_id') === this.state.dragState.playerId);
      players = players.delete(prevIndex)
        // Insert it at the new index.
        .splice(this.state.dragState.newIndex, 0, player)
        // Recompute indexes.
        .map((player, index) => player.set('index', index));
    }
    return players;
  },

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
});

export default compose(
  pure,
  setPropTypes({
    players: listOf(map).isRequired,
    selectedId: React.PropTypes.string.isRequired,
    selectPlayer: React.PropTypes.func.isRequired
  })
)(PlayerList);

