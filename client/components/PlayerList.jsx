import React from 'react';
import { compose, pure, setPropTypes } from 'recompose';
import { listOf, map } from 'react-immutable-proptypes';
import PlayerItem from './Player';

const PlayerList = ({players, selectedId, selectPlayer}) => (
  <ul className="leaderboard">
    {
      players.map((player) => {
        return (
          <PlayerItem
            key={ player.get('_id') }
            player={ player }
            selected={ selectedId == player.get('_id') }
            selectPlayer={ selectPlayer.bind(null, player.get('_id')) }
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

