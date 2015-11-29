App = props => (
  <div className="outer">
    <div className="logo"></div>
    <h1 className="title">Leaderboard</h1>
    <div className="subtitle">Select a scientist to give them points</div>

    <div>
      <PlayerList players={props.players}
                  selectedId={props.selectedId}
                  selectPlayer={props.actions.selectPlayer}/>
    </div>

    <SelectPlayer selectedName={props.selectedName}
                  incrementScore={props.actions.incrementScore.bind(null, props.selectedId)} />

  </div>
);
App.propTypes = {
  players: ImmutablePropTypes.listOf(ImmutablePropTypes.map).isRequired,
  selectedId: React.PropTypes.string.isRequired,
  selectedName: React.PropTypes.string.isRequired,

  actions: React.PropTypes.shape({
    selectPlayer: React.PropTypes.func.isRequired,
    incrementScore: React.PropTypes.func.isRequired,
  }).isRequired
};
