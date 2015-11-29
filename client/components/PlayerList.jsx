PlayerList = ({players, selectedId, selectPlayer}) => (
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
PlayerList.propTypes = {
  players: ImmutablePropTypes.listOf(ImmutablePropTypes.map).isRequired,
  selectedId: React.PropTypes.string.isRequired,
  selectPlayer: React.PropTypes.func.isRequired
};
