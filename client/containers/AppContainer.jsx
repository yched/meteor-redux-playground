import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from 'client/store/actions';
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
  // Note :
  // - Meteor.subscribe() in Tracker.autorun() is stop()ed when the computation is stopped
  // - 'loaded' : Meteor.subscribe().ready() is reactive
  static needs(getState, renderProps) {
    const props = mapStateToProps(getState(), renderProps);
    // @todo subscribe+track here and in componentWillMount ?
    // We do need to unsubscribe/stop the tracker when the component is unmounted...
    //a = {
    //  subscription: ['players', props.playerView, {listId: props.listId}],
    //  collections: {
    //    'players': [props.playerView, {listId: props.listId}]
    //  }
    //};
    Meteor.subscribe('players', props.playerView, {listId: props.listId});
    return actions.trackPlayerCollection(Mongo.Collection.get('players').findByView(props.playerView, {listId: props.listId}));
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
    // Subscribe to 'players' publication, with the current view.
    this.sub && this.sub.stop();
    this.sub = Meteor.subscribe('players', viewName, params);
    // Track the Minimongo cursor on the request we're interested in.
    this.track && this.track.stop();
    this.track = this.props.actions.trackPlayerCollection(Mongo.Collection.get('players').findByView(viewName, params));
  }

  componentWillUnmount() {
    // Unsubscribe to 'players' publication.
    this.sub.stop();
    // Stop tracking the request.
    this.track.stop();
  }


  render() {
    return (
      <App {...this.props} />
    );
  }
}

export default AppContainer;
