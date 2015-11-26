const { createSelector } = Reselect;

// AppContainer is responsible for fetching data from the store and
// listening for changes. In a larger app you would have a container
// for each major component.

let AppContainer = React.createClass({
  componentWillMount() {
    this.sub = Meteor.subscribe('players');
  },

  componentWillUnmount() {
    this.sub.stop();
  },

  render() {
    return (<App {...this.props} />);
  }
});

let mapStateToProps = createSelector(
  (state => state.players),
  (state => state.userInterface.selectedId),
  (players, selectedId) => {
    let selectedPlayer = _.findWhere(players, {_id: selectedId});
    let selectedName = selectedPlayer ? selectedPlayer.name : '';
    return {
      players,
      selectedId,
      selectedName
    }
  }
);
//let mapStateToProps = function (state) {
//  return {
//    players: state.players,
//    selectedId: state.userInterface.selectedId,
//    selectedName: 'Foo',
//  }
//};
let mapDispatchToProps = (dispatch) => {
  return {actions: Redux.bindActionCreators(Actions, dispatch)};
};
this.AppContainer = connect(mapStateToProps, mapDispatchToProps)(AppContainer);
