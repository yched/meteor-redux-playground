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
    console.log('AppContainer props', this.props);
    return (<App {...this.props} />);
  }
});

// choose what state we send to comp. above and it's children, in
// this app we're sending everything at once, we're also splitting
// it out into three properties to match previous state shape, you
// could easily just return `state` for this small app
let mapStateToProps = function (state) {
  return {
    players: state.players,
    selectedId: state.userInterface.selectedId,
    selectedPlayerName: state.userInterface.selectedPlayerName
  }
};
let mapDispatchToProps = (dispatch) => Redux.bindActionCreators(Actions, dispatch);
this.AppContainer = connect(mapStateToProps, mapDispatchToProps)(AppContainer);
