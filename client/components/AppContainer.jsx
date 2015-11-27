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
  (state => state.players),
  (state => state.userInterface.selectedId),
  (players, selectedId) => {
    let selectedPlayer = _.findWhere(players, {_id: selectedId});
    return selectedPlayer ? selectedPlayer.name : '';
  }
);
let mapStateToProps = (state) => ({
  ...state,
  userInterface: {
    ...state.userInterface,
    selectedName: selectedNameSelector(state),
  }
});

let mapDispatchToProps = (dispatch) => {
  return {
    actions: Redux.bindActionCreators(Actions, dispatch),
    dispatch
  };
};
AppContainer = connect(mapStateToProps, mapDispatchToProps)(AppContainer);
