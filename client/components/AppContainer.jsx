import React from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Immutable from 'immutable';
import visualizeRender from 'react-render-visualizer-decorator';
import actions from 'client/store/actions'
import Players from 'both/models/player';
import { PlayerRecord } from './immutable_models/player';
import App from './app';

let AppContainer = React.createClass({
  mixins: [ReactMeteorData],

  // @todo Tourne à chaque changement des props ???
  getMeteorData() {
    Meteor.subscribe('players', this.props.playerView);

    // Fetch the new players from Mini-Mongo.
    const playerView = Players.views[this.props.playerView]();
    // Do not grab the indexes, so that the immutables do not change needlessly.
    const fields = {index: 0}
    const players = Players.find(playerView.find, {fields, ...playerView.options}).fetch();
    // Key players by id for easier tracking.
    const playersById = _.indexBy(players, '_id');
    // Turn into an Immutable hash.
    const immutablePlayers = this._immutablePlayers(playersById);

    return {
      players: immutablePlayers,
      selectedPlayer: immutablePlayers.has(this.props.selectedId) ? immutablePlayers.get(this.props.selectedId) : null,
    };
  },

  // Do our best to keep the existing players immutables unchanged.
  _immutablePlayers(players) {
    // On startup, create a fresh immutable.
    const immutablePlayers = Immutable.fromJS(players, (key, value) => key ? new PlayerRecord(value) : value.toMap());
    if (!this.data.players) {
      return immutablePlayers;
    }
    // Otherwise, merge with the new elements.
    const ids = Object.keys(players);
    // @todo use withMutations to reduce the instanciations ?
    return this.data.players
      // Remove players that are not in the new list
      .filter((player, id) => players.hasOwnProperty(id))
      // Apply the same order than the new list
      .sortBy((player, id) => ids.indexOf(id))
      // Deep-merge the new data
      .mergeDeep(immutablePlayers)
  },

  incrementPlayerScore(playerId, increment) {
    Meteor.call('incrementScore', playerId, increment);
  },

  render() {
    return (
      <App {...this.props}
        players={this.data.players}
        selectedPlayer={this.data.selectedPlayer}
        incrementPlayerScore={this.incrementPlayerScore}
      />
    );
  }
});

let mapStateToProps = (state) => {
  return {
    selectedId: state.getIn(['userInterface', 'selectedId']),
    playerView: state.getIn(['userInterface', 'playerView'])
  };
};

let mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch),
    dispatch
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
