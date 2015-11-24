PlayerList = React.createClass({
  propTypes: {
    players: React.PropTypes.array.isRequired,
    selectedId: React.PropTypes.string.isRequired,
    doSelectPlayer: React.PropTypes.func.isRequired
  },

  render() {
    if (!this.props.players.length) {
      return (
        <ul className="leaderboard">
          <h2>Loading...</h2>
          <h3>*Simulating* slow server to show optimistic UI</h3>
        </ul>
      );
    }

    return (
     <ul className="leaderboard">
       {
         this.props.players.map((player) => {
           return (
             <PlayerItem
               key={ player._id }
               player={ player }
               selected={ this.props.selectedId == player._id }
               doSelectPlayer={ this.props.doSelectPlayer.bind(null, player._id) }
             />
           );
         })
       }
     </ul>
    );
  }
});
