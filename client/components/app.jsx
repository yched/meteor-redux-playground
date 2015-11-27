App = props => (
  <div className="outer">
    <div className="logo"></div>
    <h1 className="title">Leaderboard</h1>
    <div className="subtitle">Select a scientist to give them points</div>

    <div>
      <PlayerList players={props.players}
                  selectedId={props.userInterface.selectedId}
                  selectPlayer={props.actions.selectPlayer}/>
    </div>

    <SelectPlayer selectedName={props.userInterface.selectedName}
                  incrementScore={props.actions.incrementScore.bind(null, props.userInterface.selectedId)} />

  </div>
);
App.propTypes = {
  players: React.PropTypes.array.isRequired,
  userInterface: React.PropTypes.shape({
    selectedId: React.PropTypes.string.isRequired,
    selectedName: React.PropTypes.string.isRequired,
  }).isRequired,
  actions: React.PropTypes.shape({
    selectPlayer: React.PropTypes.func.isRequired,
    incrementScore: React.PropTypes.func.isRequired,
    getUrl: React.PropTypes.func.isRequired
  }).isRequired
};
