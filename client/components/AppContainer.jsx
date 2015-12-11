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
    const fields = {index: 0};
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
    const prev = this.data.players;
    return Immutable.fromJS(players, (key, value) => {
      // The function is called one last time for the whole list, with key = ''.
      if (!key) {
        return value.toMap();
      }
      // Keep the previous immutable if there is one and the data is unchanged,
      // else create a new record.
      return (prev && prev.has(key) && Immutable.is(value, prev.get(key))) ?
        prev.get(key) :
        new PlayerRecord(value);
    });
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
