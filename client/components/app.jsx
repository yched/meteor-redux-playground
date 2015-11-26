/* jshint maxlen: false */

App = React.createClass({
  propTypes: {
    players: React.PropTypes.array.isRequired,
    selectedId: React.PropTypes.string.isRequired,
    actions: React.PropTypes.shape({
      selectPlayer: React.PropTypes.func.isRequired,
      incrementScore: React.PropTypes.func.isRequired
    })
  },

  render() {
    return (
      <div className="outer">
        <div className="logo"></div>
        <h1 className="title">Leaderboard</h1>
        <div className="subtitle">Select a scientist to give them points</div>

        <div>
          <PlayerList players={this.props.players}
                      selectedId={this.props.selectedId}
                      selectPlayer={this.props.actions.selectPlayer}/>
        </div>

        <SelectPlayer selectedName={this.props.selectedName}
                      incrementScore={this.props.actions.incrementScore.bind(null, this.props.selectedId)} />
      </div>
    );
  }
});
