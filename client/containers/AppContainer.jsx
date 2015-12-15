import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from 'client/store/actions';
import * as selectors from '../selectors/index';
import Players from 'both/models/player';
import App from 'client/components/App';

// Connect to the redux store :
// Pick props that AppContainer receives from the store.
const mapStateToProps = (state) => ({
  playerView: state.playersCollection.get('viewName'),
  players: state.playersCollection.get('players'),
  // Use reselect selectors for derived data :
  selectedPlayer: selectors.selectedPlayer(state)
});
// Also pass all actions pre-bound to the store's dispatch() in props.actions,
// and the naked dispatch() itself for conveniency.
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  dispatch
});

@connect(mapStateToProps, mapDispatchToProps)
class AppContainer extends React.Component {
  componentWillMount() {
    // Subscribe to the Players publication, and track reactive changes.
    this._subscribeToPlayers(this.props.playerView, {listId: this.props.params.listId});
  }

  componentWillReceiveProps(nextProps) {
    // Re-subscribe if the view changed.
    if (nextProps.playerView !== this.props.playerView || nextProps.params.listId !== this.props.params.listId) {
      this._subscribeToPlayers(nextProps.playerView, {listId: nextProps.params.listId});
    }
  }

  _subscribeToPlayers(viewName, params) {
    // Subscribe to 'players' publication, with the current view.
    this.sub = Meteor.subscribe('players', viewName, params);
    // Track the Minimongo cursor on the request we're interested in.
    this.track && this.track.stop();
    this.track = this.props.actions.trackPlayerCollection(Players.getCursor(viewName, params));
  }

  componentWillUnmount() {
    // Unsubscribe to 'players' publication.
    this.sub.stop();
    // Stop tracking the request.
    this.track.stop();
  }

  render() {
    const appProps = {...this.props, listId: parseInt(this.props.params.listId)};
    return (
      <App {...appProps} />
    );
  }
}

export default AppContainer;
