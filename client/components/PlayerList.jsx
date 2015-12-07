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

  dragPlayer(playerId, newIndex) {
    let dragPlayers = this.state.dragPlayers || this.props.players;
    const [prevIndex, player] = dragPlayers.findEntry(player => player.get('_id') === playerId);
    this.setState({
      dragPlayers: dragPlayers
      // Remove the player from its previous index.
        .delete(prevIndex)
        // Insert it at the new index.
        .splice(newIndex, 0, player)
        // Recompute indexes.
        .map((player, index) => player.set('index', index))
    });
  },

  dropPlayer() {
    // Call 'updateIndexes' with the array of {_id, index} pairs.
    let data = [];
    this.state.dragPlayers.forEach(player => {
      data.push({_id: player.get('_id'), index: player.get('index')});
    });
    Meteor.call('updateIndexes', data);
    this.setState({dragPlayers: null});
  },

  render() {
    let props = this.props;
    let players = this.state.dragPlayers || props.players;
    return (
      <ul className="leaderboard">
        {
          players.map((player, index) => {
            const playerId = player.get('_id');
            return (
              props.sort.get('field') === 'index' ?
              <DraggablePlayerItem
                key={ playerId }
                player={ player }
                selected={ props.selectedId == playerId }
                selectPlayer={ props.selectPlayer }
                index={index}
                dragPlayer={ this.dragPlayer }
                dropPlayer={ this.dropPlayer }
              />
                :
              <PlayerItem
                key={ playerId }
                player={ player }
                selected={ props.selectedId == playerId }
                selectPlayer={ props.selectPlayer }
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

