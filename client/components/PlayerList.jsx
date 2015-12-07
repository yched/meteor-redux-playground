import React from 'react';
import { compose, pure, setPropTypes } from 'recompose';
import { listOf, map } from 'react-immutable-proptypes';
import PlayerItem from './Player';
import DraggablePlayerItem from './DraggablePlayer';

const PlayerList = (props) => (
  <ul className="leaderboard">
    {
      props.players.map((player, index) => {
        const playerId = player.get('_id');
        return (
          props.sort.get('field') === 'index' ?
            <DraggablePlayerItem
              key={ playerId }
              player={ player }
              selected={ props.selectedId == playerId }
              selectPlayer={ props.selectPlayer }
              index={index}
              dragPlayer={ props.dragPlayer }
              dropPlayer={ props.dropPlayer }
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

export default compose(
  pure,
  setPropTypes({
    players: listOf(map).isRequired,
    selectedId: React.PropTypes.string.isRequired,
    selectPlayer: React.PropTypes.func.isRequired
  })
)(PlayerList);

