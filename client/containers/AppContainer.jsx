import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from 'client/store/actions';
import * as selectors from '../selectors/index';
import App from 'client/components/App';
import Players from 'both/models/player';

// Connect to the redux store :
// Pick props that AppContainer receives from the store.
const mapStateToProps = (state, props) => ({
  playerView: state.playersCollection.get('viewName'),
  players: state.playersCollection.get('players'),
  playersLoaded: state.playersCollection.get('loaded'),
  // Add the URL param passed by the router
  listId: parseInt(props.params.listId),
  // Remote data
  remoteData: state.remoteData,
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

  // @todo see the @connectData() decorator in react-redux-universal-hot
  static fetchData(getState, dispatch, renderProps) {
    const props = mapStateToProps(getState(), renderProps);
    const params = {listId: props.listId};
    const result = dispatch(actions.trackMeteorCollection(
      {players: [props.playerView, params]},
      {players: {find: 'findByView', args: [props.playerView, params]}}
    ));
    var a = {
      subscriptions: {
        players: [props.playerView, params]
      },
      collections: {
        players: {
          find: 'findByView',
          findArgs: [props.playerView, params]
        }
      }
    };
    return result.promise;
  }

  // Subscribe to the Players publication, and track reactive changes.
  componentWillMount() {
    if (Meteor.isClient)
      this._subscribeToPlayers(this.props.playerView, {listId: this.props.listId});
  }

  // Re-subscribe if the view changed.
  componentWillReceiveProps(nextProps) {
    if (nextProps.playerView !== this.props.playerView || nextProps.listId !== this.props.listId) {
      this._subscribeToPlayers(nextProps.playerView, {listId: nextProps.listId});
    }
  }

  _subscribeToPlayers(viewName, params) {
    this.tracker && !this.tracker.stopped && this.tracker.stop();
    const result = this.props.actions.trackMeteorCollection(
      {players: [viewName, params]},
      {players: {find: 'findByView', args: [viewName, params]}}
    );
    this.tracker = result.tracker;
  }

  componentWillUnmount() {
    this.tracker && !this.tracker.stopped && this.tracker.stop();
    this.tracker = null;
  }


  render() {
    return (
      <App {...this.props} />
    );
  }
}

export default AppContainer;
