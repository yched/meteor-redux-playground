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
  playerView: state.userInterface.get('playerView'),
  //collectionsLoaded: state.collections.get('_loaded'),
  // Add the URL param passed by the router
  listId: props.params.listId,
  // Remote data
  remoteData: state.remoteData,

  // Use reselect selectors for derived data :
  playersList: selectors.playersList(state, props.params.listId),
  selectedPlayer: selectors.selectedPlayer(state)
});
// Also pass all actions pre-bound to the store's dispatch() in props.actions,
// and the naked dispatch() itself for conveniency.
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
  dispatch
});

const subscribe = (listId, dispatch) => {
  return new Promise((resolve, reject) => {
    Meteor.subscribe('playersInList', listId, {
      onReady: function () {resolve(this)},
      onStop: (err) => err && reject(err)
    })
  }).then(subscription => {
    const collectionsTracker = dispatch(actions.trackMeteorCollection({
      lists: [{_id: listId}],
      players: []
    }));
    return function stop() {
      collectionsTracker.stop();
      subscription.stop();
    }
  });
};

@connect(mapStateToProps, mapDispatchToProps)
class AppContainer extends React.Component {

  // @todo see the @connectData() decorator in react-redux-universal-hot
  // also, react-fetcher
  static fetchData(getState, dispatch, renderProps) {
    return subscribe(renderProps.params.listId, dispatch);
  }

  // Subscribe to the publications, and track reactive changes.
  componentWillMount() {
    if (Meteor.isClient)
      this._subscribeToCollections(this.props.listId);
  }

  // Re-subscribe if the listId changed.
  componentWillReceiveProps(nextProps) {
    if (nextProps.listId !== this.props.listId) {
      this._subscribeToCollections(nextProps.listId);
    }
  }

  _subscribeToCollections(listId) {
    this.tracker && !this.tracker.stopped && this.tracker.stop();
    subscribe(listId, this.props.dispatch)
      .then(stopTracking => {
        this.tracker = {
          stopped: false,
          stop: () => {this.stopped = true; stopTracking();}
        }
      });
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
