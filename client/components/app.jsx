/* jshint maxlen: false */

App = React.createClass({
  propTypes: {
    players: React.PropTypes.array.isRequired,
    selectedId: React.PropTypes.string,

    selectPlayer: React.PropTypes.func.isRequired,
    incrementScore: React.PropTypes.func.isRequired,
  },

  render() {
    console.log('[App] rendering');
    let players = this.props.players ? this.props.players.find({}, {sort: {score: -1}}).fetch() : [];
    let selectedName = (this.props.selectedId && this.props.players) ? this.props.players.findOne(this.props.selectedId).name : '';
    return (
      <div className="outer">
        <div className="logo"></div>
        <h1 className="title">Leaderboard</h1>
        <div className="subtitle">Select a scientist to give them points</div>

        <div>
          <PlayerList players={players}
                      selectedId={this.props.selectedId}
                      doSelectPlayer={this.props.selectPlayer}/>
        </div>

        <SelectPlayer selectedName={selectedName}
                      doIncrementScore={this.props.incrementScore.bind(null, this.props.selectedId)} />
      </div>
    );
  }
});
