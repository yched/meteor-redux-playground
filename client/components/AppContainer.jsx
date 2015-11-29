const { createSelector } = Reselect;

// AppContainer is responsible for fetching data from the store and
// listening for changes. In a larger app you would have a container
// for each major component.

AppContainer = React.createClass({
  componentWillMount() {
    this.sub = Meteor.subscribe('players');
    trackCollection(Players, (collection) => {
      this.props.dispatch({
        type: 'UPDATE_PLAYERS',
      });
    });
  },

  componentWillUnmount() {
    this.sub.stop();
  },

  render() {
    return (<App {...this.props} />);
  }
});

// Use createSelector's memoization for the 'selectedName' derived data.
let selectedNameSelector = createSelector(
  (state => state.get('players')),
  (state => state.get('userInterface').get('selectedId')),
  (players, selectedId) => {
    let selectedPlayer = players.find(player => player.get('_id') === selectedId);
    let selectedName = selectedPlayer ? selectedPlayer.get('name') : '';
    return selectedName;
  }
);
let mapStateToProps = (state) => {
  return {
    players: state.get('players'),
    selectedId: state.getIn(['userInterface', 'selectedId']),
    selectedName: selectedNameSelector(state)
  };
};

let mapDispatchToProps = (dispatch) => {
  return {
    actions: Redux.bindActionCreators(Actions, dispatch),
    dispatch
  };
};
AppContainer = connect(mapStateToProps, mapDispatchToProps)(AppContainer);
