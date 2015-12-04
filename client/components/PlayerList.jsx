import React from 'react';
import { compose, pure, setPropTypes } from 'recompose';
import { listOf, map } from 'react-immutable-proptypes';
import PlayerItem from './Player';
import DraggablePlayerItem from './DraggablePlayer';

const PlayerList = ({players, selectedId, selectPlayer}) => (
  <ul className="leaderboard">
    {
      players.map((player, index) => {
        return (
          <DraggablePlayerItem
            index={index}
            key={ player.get('_id') }
            player={ player }
            selected={ selectedId == player.get('_id') }
            selectPlayer={ selectPlayer }
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

