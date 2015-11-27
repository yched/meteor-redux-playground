PlayerList = props => (
  <ul className="leaderboard">
    {
      props.players.map((player) => {
        return (
          <PlayerItem
            key={ player._id }
            player={ player }
            selected={ props.selectedId == player._id }
            selectPlayer={ props.selectPlayer.bind(null, player._id) }
          />
        );
      })
    }
  </ul>
);
PlayerList.propTypes = {
  players: React.PropTypes.array.isRequired,
  selectedId: React.PropTypes.string.isRequired,
  selectPlayer: React.PropTypes.func.isRequired
};
